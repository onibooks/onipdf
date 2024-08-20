import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const renderToImage = (context: GlobalContext) => async (index: number = 0) => {
  const z = devicePixelRatio * 96 / 72
  const pixmapImage = await context.worker.getPixmapImage(index, z)
  
  const image = new Image()
  image.src = URL.createObjectURL(new Blob([pixmapImage], { type: 'image/png' }))
  image.style.width = '100%'
  
  context.oniPDF.emit(EVENTS.RENDERED, image)
  
  return image
  
}