import type { WorkerContext } from '../worker.js'

export const getCanvasPixels = (context: WorkerContext) => (index: number, dpi: number) => {
  const PDFPage = context.PDFPages[index]
  const bounds = context.commands.getBounds(index)
  const { Matrix, Rect, Pixmap, ColorSpace, DrawDevice } = context.mupdf

  const pdfDocToScreen = Matrix.scale(dpi / 72, dpi / 72)
  const boundsBox = Rect.transform(bounds, pdfDocToScreen)
  const pixmap = new Pixmap(ColorSpace.DeviceRGB, boundsBox, true)
  pixmap.clear(255)

  const device = new DrawDevice(pdfDocToScreen, pixmap)
  PDFPage.run(device, Matrix.identity)

  const imageData = new ImageData(pixmap.getPixels().slice(), pixmap.getWidth(), pixmap.getHeight())
  pixmap.destroy()

  return imageData
}
