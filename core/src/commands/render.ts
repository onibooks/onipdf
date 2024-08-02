import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const render = (context: GlobalContext) => async (index = 0) => {
  // const z = window.devicePixelRatio * 96 / 72
  const png = await context.worker.loadPage(index)

  context.oniPDF.emit(EVENTS.LOAD, { blobPng: png })
}
