import { EVENTS } from '../constants'
import { provider } from '../provider'
import { createPageView } from './createPageView'

const fetchBlobFromURL = async (url: string): Promise<Blob> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`파일을 가져오는데 실패했습니다. ${url}: ${response.statusText}`)
  }

  const blob = await response.blob()
  return blob
}

const fetchFileFromURL = async (url: string): Promise<File> => {
  const blob = await fetchBlobFromURL(url)
  const filename = url.split('/').pop() || '다운로드된 파일'
  const file = new File([blob], filename, { type: blob.type })

  return file
}

export const initPageView = () => provider(async (context) => {
  // const totalPages = await context.oniPDF.getTotalPages()
  const total = await context.oniPDF.getTotalPages()
  const { totalPages } = context.presentation.locate({
    totalPages: total
  })
  const pageViews = Promise.all(Array(totalPages)
  .fill(null)
  .map((_, index) => createPageView(index)))

  // context.totalPages = await totalPages
  context.pageViews = await pageViews
})

export const createPDFDocument = (url: string) => provider(async (context) => {
  try {
    const file = await fetchFileFromURL(url)
    const arrayBuffer = await file.arrayBuffer()
    
    context.oniPDF.openDocument(arrayBuffer)
      .then(async () => {
        await initPageView()
        context.oniPDF.emit(EVENTS.OPEN, { document })
      })
  }
  catch(error) {
    console.error('파일을 읽어드리는데 실패했습니다. ', error)
  }
})
