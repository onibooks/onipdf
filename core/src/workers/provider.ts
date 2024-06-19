import type * as MuPDF from 'mupdf'

let uid = 0

export type WorkerContext = {
  document: MuPDF.Document
}

const workerContext = new Map<number, WorkerContext>()

export const createContext = () => {
  const context: WorkerContext = {
    document: null as any
  }

  workerContext.set(uid++, context)

  return context
}

export const provider = <T>(
  consumer: (context: WorkerContext) => T
): T => {
  const contextId = uid - 1
  const context = workerContext.get(contextId)
  if (!context) {
    throw new Error(`${contextId} 컨텍스트가 존재하지 않습니다.`)
  }

  return consumer(context)
}