import type { WorkerContext } from '../worker.js'

export const closeDocument = (context: WorkerContext) => () => {
  context.document.destroy()
}