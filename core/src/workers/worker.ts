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

const createContext = (contextId: number): WorkerContext => {
  const context = {
    mupdf,
    commands: null as any,
    document: null as any,
  }
  context.commands = createCommands(context)

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

    self.postMessage({
      type: 'setup',
      commands: Object.keys(context.commands)
    })
  } catch (error) {
    console.error('worker setup:', error)
  }
}

const onCommands = async (event: MessageEvent) => {
  console.log('onCommands: ', event)
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