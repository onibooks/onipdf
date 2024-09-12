import type { GlobalContext } from '../provider'

export const updateSize = (context: GlobalContext) => async (index: number = 0) => {
  const pageSize = await context.worker.getPageSize(index)
  const zoom = context.zoom ?? 96

  const width = (pageSize.width * zoom) / 72 | 0
  const height = (pageSize.height * zoom) / 72 | 0

  return {
    width,
    height
  }
}