import * as commands from './commands/index.js'

import { provider } from '../provider.js'

export type MuPDFWorker = Worker & {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

const onSetup = (event: MessageEvent, contextId: number) => {
  const worker = event.currentTarget as MuPDFWorker
  const { commands } = event.data
  
}

const onCommands = (event: MessageEvent) => {
  
}

export const createWorker = (muPDFSrc: string): Promise<MuPDFWorker> => provider((context) => {
  return new Promise((resolve, rejected) => {
    const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent) => {
      const { type } = event.data
      switch (type) {
        case 'setup':
          onSetup(event, context.uid)
          break
        default:
          onCommands(event)
      }

      resolve(worker as MuPDFWorker)
    }

    worker.postMessage({ type: 'setup', muPDFSrc, contextId: context.uid })
  })
})
