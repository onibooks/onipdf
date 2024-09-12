import type { WorkerContext } from '../worker.js'

export const getPageText = (context: WorkerContext) => (index: number) => {
  const PDFPage = context.PDFPages[index]

  const text = PDFPage.toStructuredText().asJSON()
  const pageText = JSON.parse(text)

  return pageText
}
