import type { GlobalContext } from '../provider'

export const getZoom = (context: GlobalContext) => () => {
  const { sangte } = context
  const { scale } = sangte.getState()

  return scale 
}
