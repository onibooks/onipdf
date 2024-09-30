import type { GlobalContext } from '../provider'

export const setZoom = (context: GlobalContext) => async (scale: number = 1) => {
  const { sangte } = context
  const { cachedScale } = sangte.getState()

  if (cachedScale !== scale) {
    sangte.setState({ cachedScale: scale })
  }

  const { cachedScale: updatedScale } = sangte.getState()
  console.log('cachedScale', updatedScale)
}
