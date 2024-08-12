import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const loadPage = (context: GlobalContext) => async (index: number = 0) => {
  const data = await context.worker.loadPage(index)
  context.pages[index] = data

  context.oniPDF.emit(EVENTS.LOAD, { data })
}
