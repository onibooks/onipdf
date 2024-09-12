import type { GlobalContext } from '../provider'

export const getPDFPage = (context: GlobalContext) =>  async (index: number = 0) => {
  const pageSize = context.worker.getPageSize(index)
  const pageText = context.worker.getPageText(index)
  const pageLinks = context.worker.getPageLinks(index)

  return {
    pageSize,
    pageText,
    pageLinks
  }
}