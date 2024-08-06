// import { EVENTS } from '../constants'
// import { renderPageToImage } from '../presentation/rendering'
import { GlobalContext } from '../provider'

export const renderToSvg = (context: GlobalContext) => async (index: number = 0) => {
  console.log('renderToSvg', context)
  const devicePixelRatio = window.devicePixelRatio
  // const png = await context.worker.loadPage(devicePixelRatio, index).asPNG()
 
  // context.oniPDF.emit(EVENTS.LOAD, { blobPng: png })
}