import type { WorkerContext } from '../worker.js'

export const renderToImage = (context: WorkerContext) => (z: any, index: number = 0) => {
  // const page = context.document.loadPage(index)
  // const { ColorSpace } = context.mupdf
  
  // const png = page.toPixmap([z, 0, 0, z, 0, 0], ColorSpace.DeviceRGB, true, true).asPNG()

  // return png
}