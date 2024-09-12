import type { GlobalContext } from '../provider'

export const getTotalPages = (context: GlobalContext) => async () => (
  await context.worker.getTotalPages()
)