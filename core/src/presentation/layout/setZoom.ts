import { EVENTS } from '../../constants'

import type { GlobalContext } from '../../provider'
import type { LayoutOptions } from './createLayout'

export const setZoom = (context: GlobalContext) => (value: LayoutOptions['zoom'] = 1) => {
  const { oniPDF, sangte } = context
  const { scale } = sangte.getState()

  if (value >= 10 && value <= 200) {
    value = value / 100
  }
  value = Math.min(Math.max(0.1, value), 2)

  if (scale !== value) {
    sangte.setState({ scale: value })
  }

  const { scale: updatedScale } = sangte.getState()
  if (scale !== updatedScale) {
    // oniPDF.emit((EVENTS.UPDATESCALE), { scale: updatedScale })
  }

  return updatedScale
}