/**
 * 여러 모듈에서 공유할 수 있는 컨텍스트를 제공합니다.
 * 'provider' 함수는 호출되는 시점에 따라 어떤 컨텍스트가 사용될지 결정되므로 호출 시점을 주의 깊게 고려해야 합니다.
 * 'Provider', 'Context'와 같은 용어는 React의 Context API를 연상시키지만, React와는 관련이 없습니다.
 */
import type { BookInstance } from './createBook'
import type { Sangte } from './sangte'

export type GlobalContext = {
  uid: number
  instance: BookInstance
  worker: Worker
  sangte: Sangte
}

let uid = 0

const globalContext = new Map<number, GlobalContext>()

export const createContext = () => {
  const context: GlobalContext = {
    uid,
    instance: null as any,
    worker: null as any,
    sangte: null as any
  }

  globalContext.set(uid++, context)

  return context
}

export const provider = <T>(
  consumer: (context: GlobalContext) => T
): T => {
  const contextId = uid - 1
  const context = globalContext.get(contextId)
  if (!context) {
    throw new Error(`${contextId} 컨텍스트가 존재하지 않습니다.`)
  }

  return consumer(context)
}