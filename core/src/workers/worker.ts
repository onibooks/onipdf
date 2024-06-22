import * as commands from './commands.js'

import type * as MuPDF from 'mupdf'

export type Commands = {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

type WorkerContext = {
  commands: Commands
}

let mupdf: typeof MuPDF

const workerContext = new Map<number, WorkerContext>()

const createCommands = (context) => (
  Object.entries(commands).reduce((commandSet, [commandKey, commandFn]) => {
    if (typeof commandFn === 'function') {
      (commandSet as any)[commandKey] = commandFn(context)
    }

    return commandSet
  }, {})  
)

const createContext = (contextId) => {
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
    context.commands = createCommands(context)

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
  const command = context.commands[type]
  if (!command) {
    return
  }

  try {
    const value = command(...Object.values(args))
    postMessage({
      type: 'command',
      promisesId,
      value
    })
  } catch (error) {
    console.error('worker command:', error)
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