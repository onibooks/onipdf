import type { WorkerContext } from '../worker.js'

export const loadPage = (context: WorkerContext) => (index: number = 0) => {
  if (context.PDFPages[index]) return true

  try {
    const page = context.document.loadPage(index)
    context.PDFPages[index] = page

    return true
  } catch (error) {
    console.error(`ERROR loadPage: ${error}`)

    return false
  }
}
