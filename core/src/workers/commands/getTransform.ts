import type { WorkerContext } from '../worker.js'

export const getTransform = (context: WorkerContext) => (index: number) => {
  const PDFPage = context.PDFPages[index]
  
  return PDFPage.getTransform()
}
