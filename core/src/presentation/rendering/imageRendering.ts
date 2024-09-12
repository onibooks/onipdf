import { EVENTS } from '../../constants'

import type { GlobalContext } from '../../provider'

export const renderPageToImage = (context: GlobalContext) => async (index: number = 0) => {
  const devicePixelRatio = window.devicePixelRatio
  // const png = await context.worker.loadPage(devicePixelRatio, index).asPNG()
 
  // context.oniPDF.emit(EVENTS.LOAD, { blobPng: png })
}

export const clearImage = () => () => {

}