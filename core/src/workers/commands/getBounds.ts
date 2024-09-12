import type { WorkerContext } from '../worker.js'

export const getBounds = (context: WorkerContext) => (index: number) => {
  const PDFPage = context.PDFPages[index]

  return PDFPage.getBounds()
}
