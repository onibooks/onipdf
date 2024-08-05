import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const loadPage = (context: GlobalContext) => async (index: number = 0) => {
  const devicePixelRatio = window.devicePixelRatio
  const data = await context.worker.loadPage(devicePixelRatio, index)

  context.pages[index] = data

  context.oniPDF.emit(EVENTS.LOAD, { data })
}
