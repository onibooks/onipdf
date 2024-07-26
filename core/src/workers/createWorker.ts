import * as commands from './commands/index.js'

import { provider } from '../provider.js'

export type MuPDFWorker = Worker & {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

let promiseId = 0
const promises = new Map<number, { resolve: Function, reject: Function }>()

const onSetup = (event: MessageEvent, contextId: number) => {
  const worker = event.currentTarget as MuPDFWorker
  const { commands } = event.data

  commands.forEach((command: string) => {
    (worker as any)[command] = (...args: string[]) => (
      new Promise((resolve, reject) => {
        worker.postMessage({
          type: command,
          contextId,
          promiseId,
          ...args
        })

        promises.set(promiseId++, { resolve, reject })
      })
    )
  })
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
