import type { WorkerContext } from '../worker.js'

export const getTotalPages = (context: WorkerContext) => () => {
  return context.document.countPages()
}