import type { WorkerContext } from '../worker.js'

export const loadPage = (context: WorkerContext) => (index: number | 0) => {
  const { Matrix, ColorSpace } = context.mupdf
  const page = context.document.loadPage(index)
  const pixmap = page.toPixmap(Matrix.identity, ColorSpace.DeviceRGB, true, true)

  return pixmap.asPNG()
}