import * as commands from './commands/index.js'
import { createCommands, type Commands } from './commands/createCommands.js'

// @ts-ignore
import * as MuPDF from 'mupdf'

export type WorkerContext = {
  mupdf: typeof MuPDF
  document: MuPDF.Document
  commands: Commands
}

let mupdf: typeof MuPDF

const workerContext = new Map<number, WorkerContext>()

const createContext = (contextId: number) => {
  const context = {
    mupdf,
    commands: null as any,
    document: null as any,
  }

  workerContext.set(contextId, context)

  return context
}

const onSetup = async (event: MessageEvent) => {
  if (mupdf) {
    return
  }

  const { muPDFSrc, contextId } = event.data
  try {
    mupdf = await import(/* @vite-ignore */ muPDFSrc)

    const context = createContext(contextId)
    context.commands = createCommands(context) as Commands

    postMessage({ 
      type: 'setup',
      commands: Object.keys(commands)
    })
  } catch (error) {
    console.error('worker setup:', error)
  }
}

const onCommands = async (event: MessageEvent) => {
  const { type, contextId, promisesId, ...args } = event.data
  const context = workerContext.get(contextId) as WorkerContext
  const command = (context.commands as any)[type]
  if (!command) {
    return
  }

  try {
    const value = command(...Object.values(args))
    postMessage({ type: 'command', promisesId, value })
  } catch (error) {
    postMessage({ type: 'command', promisesId, error })
  }
}

const onMessage = async (event: MessageEvent) => {
  const { type } = event.data
  switch (type) {
    case 'setup':
      onSetup(event)
      break
    default:
      onCommands(event)
  }
}

self.addEventListener('message', onMessage)