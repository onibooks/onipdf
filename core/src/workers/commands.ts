import type { WorkerContext } from './worker.js'

export const openDocument = (context: WorkerContext) => (buffer: Buffer, magic: string) => {
  context.document = context.mupdf.Document.openDocument(buffer, magic)
}

export const closeDocument = (context: WorkerContext) => () => {
  context.document.destroy()
}