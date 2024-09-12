import type { WorkerContext } from '../worker.js'

export const getPixmapImage = (context: WorkerContext) => (index: number = 0, z: any) => {
  const PDFPage = context.document.loadPage(index)
  const { ColorSpace } = context.mupdf
  const pixmapImage = PDFPage.toPixmap([z, 0, 0, z, 0, 0], ColorSpace.DeviceRGB, true, true).asPNG()

  return pixmapImage
}