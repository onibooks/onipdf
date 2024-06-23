import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const openDocument = (context: GlobalContext) => async (buffer: Buffer | ArrayBuffer) => {
  await context.worker.openDocument(buffer)

  context.instance.emit(EVENTS.OPEN)
}