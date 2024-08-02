import type { WorkerContext } from '../worker.js'

export const loadPage = (context: WorkerContext) => (devicePixelRatio: number, index = 0) => {
  const { ColorSpace } = context.mupdf
  const z = devicePixelRatio * 96 / 72
  
  const page = context.document.loadPage(index)
  const pixmap = page.toPixmap([z, 0, 0, z, 0, 0], ColorSpace.DeviceRGB, true, true)

  return pixmap.asPNG()
}