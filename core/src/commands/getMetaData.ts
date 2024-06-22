import type { GlobalContext } from '../provider'

export const getMetaData = (context: GlobalContext) => async () => (
  await context.worker.getMetaData()
)
