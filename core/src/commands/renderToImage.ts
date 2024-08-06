import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const renderToImage = (context: GlobalContext) => async (index: number = 0) => {
  const z = devicePixelRatio * 96 / 72
  const png = await context.worker.renderToImage(z, index)
  
  const image = new Image()
  image.src = URL.createObjectURL(new Blob([png], { type: 'image/png' }))
  
  context.oniPDF.emit(EVENTS.RENDERED)
  
  return image
}