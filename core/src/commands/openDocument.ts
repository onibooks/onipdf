import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'

export const openDocument = (context: GlobalContext) => (buffer: Buffer | ArrayBuffer) => {
  context.worker.openDocument(buffer)

  context.oniPDF.emit(EVENTS.OPEN)
}