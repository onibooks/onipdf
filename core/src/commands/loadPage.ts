import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

// context.pages[index] = data
export const loadPage = (context: GlobalContext) => async (index: number = 0) => {
  if (context.loaded) return

  const loaded = await context.worker.loadPage(index)
  context.loaded = loaded

  context.oniPDF.emit(EVENTS.LOAD, { loaded: context.loaded })
}
