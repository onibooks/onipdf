import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const renderToCanvas = (context: GlobalContext) => async (index: number = 0) => {
  const zoom = context.zoom ?? 96
  const canvas = await context.worker.getCanvasPixels(index, zoom * devicePixelRatio)
  
  const canvasNode = document.createElement('canvas') as HTMLCanvasElement
  const canvasContext = canvasNode.getContext('2d') as CanvasRenderingContext2D
  
  canvasNode.width = canvas.width
  canvasNode.height = canvas.height
  canvasContext?.putImageData(canvas, 0, 0)
  
  const pageSize = await context.worker.getPageSize(index)
  canvasNode.style.width = `${(pageSize.width * zoom) / 72 | 0}px`
  canvasNode.style.height = `${(pageSize.height * zoom) / 72 | 0}px`

  context.oniPDF.emit(EVENTS.RENDERED)

  return canvasNode
}
