import { EVENTS } from '../constants'
// import { renderPageToImage } from '../presentation/rendering'
import { GlobalContext } from '../provider'

export const renderToCanvas = (context: GlobalContext) => async () => {
  // 1. mupdf가 main 스레드에서도 필요한데 어떻게 해결할지
  // @ts-ignore
  const mupdf = await import(/* @vite-ignore */ context.oniPDF.mupdf)
  // 2. loadPage 실행시 return된 데이터를 이용해야해서 임시로 context.pages[index]에 값을 넣어줬는데.. page.getBounds()에 접근하면 오류발생..
  const index = context.options.page!
  const pageData = context.pages[index]
  const page = pageData.page
  console.log(page.getBounds()) // 여기서 오류


  
  // const { Matrix, Rect, Pixmap, ColorSpace, DrawDevice } = mupdf
  // const zoom = 1
  // const dpi = zoom * devicePixelRatio
  // const docToScreen = Matrix.scale(dpi / 72, dpi / 72)
  // const bbox = Rect.transform(page.getBounds(), docToScreen)
	
  // const pixmap = new Pixmap(ColorSpace.DeviceRGB, bbox, true)
  // pixmap.clear(255)

  // const device = new DrawDevice(docToScreen, pixmap)
  // await page.run(device, Matrix.identity)
	// device.close()

  // const imageData = new ImageData(pixmap.getPixels().slice(), pixmap.getWidth(), pixmap.getHeight())
	// pixmap.destroy()
  
  // const canvasNode = document.createElement('canvas')
	// const canvasCtx = canvasNode.getContext('2d')
	// context.rootElement.appendChild(canvasNode)

  // canvasNode.width = imageData.width
  // canvasNode.height = imageData.height
  // canvasCtx?.putImageData(imageData, 0, 0)
  
  // context.oniPDF.emit(EVENTS.RENDERED)
}