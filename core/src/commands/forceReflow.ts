import type { GlobalContext } from '../provider'

type ResizeEvent = Event & { isForceReflow: boolean }

export const forceReflow = (context: GlobalContext) => () => {
  const resizeEvent = new Event('resize') as ResizeEvent
  resizeEvent.isForceReflow = true

  window.dispatchEvent(resizeEvent)
}