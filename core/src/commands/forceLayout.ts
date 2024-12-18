import type { GlobalContext } from '../provider'

type ResizeEvent = Event & { isForceLayout: boolean }

export const forceLayout = (context: GlobalContext) => () => {
  const resizeEvent = new Event('resize') as ResizeEvent
  resizeEvent.isForceLayout = true

  window.dispatchEvent(resizeEvent)
}