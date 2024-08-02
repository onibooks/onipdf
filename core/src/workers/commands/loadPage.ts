import type { WorkerContext } from '../worker.js'

export const loadPage = (context: WorkerContext) => (index: number) => {
  const { Matrix, ColorSpace } = context.mupdf
  const page = context.document.loadPage(index)
  const pixmap = page.toPixmap(Matrix.identity, ColorSpace.DeviceRGB, true, true)
  // const pixmap = page.toPixmap([z, 0, 0, z, 0, 0], ColorSpace.DeviceRGB, true, true)

  return pixmap.asPNG()
}