import * as commands from './commands/index.js'

import { provider } from '../provider.js'

export type MuPDFWorker = Worker & {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

let promisesId = 0
const promises = new Map<number, { resolve: Function, reject: Function }>()

const onSetup = (event: MessageEvent, contextId: number) => {
  const mainWorker = event.currentTarget as MuPDFWorker
  const { commands } = event.data
  
  commands.forEach((command: string) => {
    (mainWorker as any)[command] = (...args: any[]) => (
      // 워커 스레드에서 불려진 함수가 언제 끝날지 모르니 메인 스레드에서 순서를 보장하기 위해서 promise로 한번 감싸준다.
      new Promise((resolve, reject) => {
        // 메서드를 실행할 때마다 promise가 만들어진다.
        
        mainWorker.postMessage({
          type: command,
          contextId,
          promisesId,
          ...args
        })

        promises.set(promisesId++, { resolve, reject })
      })
    )
  })
}

const onCommands = (event: MessageEvent) => {
  const { value, error, promisesId } = event.data
  const promise = promises.get(promisesId)! // 값이 null 또는 undefined가 아님을 확신시켜주는 문법 (값이 없을 경우 런타임 에러가 발생할 수 있다.)
  promises.delete(promisesId)

  if (error) {
    promise.reject(error)
  } else {
    promise.resolve(value)
  }
}

export const createWorker = (muPDFSrc: string): Promise<MuPDFWorker> => provider((context) => {
  return new Promise((resolve, rejected) => {
    const mainWorker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })

    mainWorker.onmessage = (event: MessageEvent) => {
      const { type } = event.data
      switch (type) {
        case 'setup':
          onSetup(event, context.uid)
          break
        default:
          onCommands(event)
      }

      resolve(mainWorker as MuPDFWorker)
    }

    mainWorker.postMessage({ type: 'setup', muPDFSrc, contextId: context.uid })
  })
})
