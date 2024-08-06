import type { WorkerContext } from '../worker.js'

export const renderToCanvas = (context: WorkerContext) => (dpi: any, index: number = 0) => {
  const page = context.document.loadPage(index)
  
  const { Matrix, Rect, Pixmap, ColorSpace, DrawDevice } = context.mupdf
  const docToScreen = Matrix.scale(dpi / 72, dpi / 72)
  const bbox = Rect.transform(page.getBounds(), docToScreen)
	const pixmap = new Pixmap(ColorSpace.DeviceRGB, bbox, true)
  pixmap.clear(255)

  const device = new DrawDevice(docToScreen, pixmap)
  page.run(device, Matrix.identity)
	device.close()

  const imageData = new ImageData(pixmap.getPixels().slice(), pixmap.getWidth(), pixmap.getHeight())
	pixmap.destroy()

  return imageData
}