import * as commands from './commands.js'

import type * as MuPDF from 'mupdf'

export type Commands = {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

type WorkerContext = {
  commands: Commands
}

let mupdf: typeof MuPDF

let uid = 0

const workerContext = new Map<number, WorkerContext>()

const createCommands = (context) => (
  Object.entries(commands).reduce((commandSet, [commandKey, commandFn]) => {
    if (typeof commandFn === 'function') {
      (commandSet as any)[commandKey] = commandFn(context)
    }

    return commandSet
  }, {})  
)

const createContext = () => {
  const context = {
    uid,
    mupdf,
    commands: null as any,
    document: null as any,
  }

  workerContext.set(uid++, context)

  return context
}

const onReady = async (event: MessageEvent) => {
  if (mupdf) {
    return
  }

  const { muPDFSrc } = event.data
  try {
    mupdf = await import(/* @vite-ignore */ muPDFSrc)

    const context = createContext()
    context.commands = createCommands(context)

    self.postMessage({
      type: 'ready',
      uid: context.uid,
      commands: Object.keys(commands)
    })
  } catch (error) {
    console.error('worker ready:', error)
  }
}

const onCommands = async (event: MessageEvent) => {
  const { type, uid, ...args } = event.data
  const context = workerContext.get(uid) as WorkerContext
  const command = context.commands[type]
  if (!command) {
    return
  }

  try {
    const value = command(...Object.values(args))
    self.postMessage({
      type: 'command',
      value
    })
  } catch (error) {
    console.error('worker command:', error)
  }
}

const onMessage = async (event: MessageEvent) => {
  const { type } = event.data
  switch (type) {
    case 'ready':
      onReady(event)
      break
    default:
      onCommands(event)
  }
}

self.addEventListener('message', onMessage)