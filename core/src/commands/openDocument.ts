import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const openDocument = (context: GlobalContext) => async (buffer: Buffer | ArrayBuffer) => {
  const document = await context.worker.openDocument(buffer)
  
  // context.oniPDF.emit(EVENTS.OPEN, { document })

  return document
}
