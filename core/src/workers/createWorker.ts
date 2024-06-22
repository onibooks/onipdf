import { provider } from '../provider.js'
import * as commands from './commands.js'

export type MuPDFWorker = Worker & {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

const promises = new Map<number, { resolve: Function, rejected: Function }>()
let promisesId = 0

const onSetup = (event: MessageEvent, contextId: number) => {
  const worker = event.currentTarget as MuPDFWorker
  const { commands } = event.data
  commands.forEach((command: string) => {
    (worker as any)[command] = (...args: any[]) => (
      new Promise((resolve, rejected) => {
        worker.postMessage({
          type: command,
          contextId,
          promisesId,
          ...args
        })

        promises.set(promisesId++, { resolve, rejected })
      })
    )
  })
}

const onCommands = (event: MessageEvent) => {
  const { value, promisesId } = event.data
  const promise = promises.get(promisesId)!
  promise.resolve(value)
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