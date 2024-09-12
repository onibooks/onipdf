import type { WorkerContext } from '../worker.js'

export const getPageSize = (context: WorkerContext) => (index: number) => {
  const bounds = context.commands.getBounds(index)
  
  const pageSize = {
    width: bounds[2] - bounds[0],
    height: bounds[3] - bounds[1]
  }

  return pageSize
}
