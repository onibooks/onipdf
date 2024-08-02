import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const render = (context: GlobalContext) => async (index = 0) => {
  const devicePixelRatio = window.devicePixelRatio
  const png = await context.worker.loadPage(devicePixelRatio, index)

  context.oniPDF.emit(EVENTS.LOAD, { blobPng: png })
}
