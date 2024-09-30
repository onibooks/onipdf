import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const setZoom = (context: GlobalContext) => (newScale: number = 1) => {
  const { sangte } = context
  const { scale } = sangte.getState()

  if (newScale >= 10 && newScale <= 200) {
    newScale = newScale / 100
  }
  newScale = Math.max(Math.min(0.1, newScale), 2)

  if (scale !== newScale) {
    sangte.setState({ scale: newScale })
  }

  const { scale: updatedScale } = sangte.getState()
  context.oniPDF.emit((EVENTS.RESIZE), { scale: updatedScale })
  
  return updatedScale
}
