import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const renderToCanvas = (context: GlobalContext) => async (index: number = 0) => {
  const zoom = 100
  const dpi = zoom * window.devicePixelRatio

  const imageData = await context.worker.renderToCanvas(dpi, index)

  const canvasNode = document.createElement('canvas')
	const canvasCtx = canvasNode.getContext('2d')

  canvasNode.width = imageData.width
  canvasNode.height = imageData.height
  canvasCtx?.putImageData(imageData, 0, 0)
  
  context.oniPDF.emit(EVENTS.RENDERED)

  return canvasNode
}