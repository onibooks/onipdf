import { EVENTS } from '../constants'
import { type GlobalContext, provider } from '../provider'

export class PageView {
  static context: GlobalContext
  public index: number
  public isLoad = false

  constructor (index: number) {
    this.index = index
  }

  get context () {
    return PageView.context
  }

  async load () {
    if (this.isLoad) {
      return
    }
    this.isLoad = true

    await this.context.worker.loadPage(this.index)

    this.context.oniPDF.emit(EVENTS.LOAD, this)

    return this
  }

  async size (index: number): Promise<{ width: number, height: number}> {
    return await this.context.worker.getPageSize(index)
  }

  async renderToCanvas () {
    const page = this.index ?? this.context.options.page
    const zoom = this.context.zoom ?? 96
    const canvas = await this.context.worker.getCanvasPixels(page, zoom * devicePixelRatio)
    
    const canvasNode = document.createElement('canvas') as HTMLCanvasElement
    const canvasContext = canvasNode.getContext('2d') as CanvasRenderingContext2D
    
    canvasNode.width = canvas.width
    canvasNode.height = canvas.height
    canvasContext?.putImageData(canvas, 0, 0)
    
    const pageSize = await this.context.worker.getPageSize(page)
    canvasNode.style.width = `${(pageSize.width * zoom) / 72 | 0}px`
    canvasNode.style.height = `${(pageSize.height * zoom) / 72 | 0}px`

    this.context.oniPDF.emit(EVENTS.RENDERED, canvasNode)

    return canvasNode
  }

  async renderToImage () {
    const z = devicePixelRatio * 96 / 72
    const pixmapImage = await this.context.worker.getPixmapImage(this.index, z)
    
    const image = new Image()
    image.src = URL.createObjectURL(new Blob([pixmapImage], { type: 'image/png' }))
    image.style.width = '100%'
    
    this.context.oniPDF.emit(EVENTS.RENDERED, image)
    
    return image
  }
}

export const createPageView = (index: number) => provider((context) => {
  PageView.context = context
  const pageView = new PageView(index)
  
  return pageView
})
