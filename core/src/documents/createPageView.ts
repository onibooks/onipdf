import { EVENTS } from '../constants'
import { provider, type GlobalContext } from '../provider'

export class PageView {
  static context: GlobalContext
  public index: number
  public zoom: number
  public pageSize: {width: number, height: number}
  public rootNode: HTMLDivElement
  public canvasNode: HTMLCanvasElement
  public canvasContext: CanvasRenderingContext2D | null
  public isLoad = false
  public isRendered = false

  constructor (index: number) {
    this.index = index
    this.zoom = this.context.zoom ?? 96

    this.rootNode = document.createElement('div')
		this.rootNode.id = 'page' + (this.index + 1)
		this.rootNode.dataset.index = String(this.index)
		this.rootNode.className = 'page'
    
    this.canvasNode = document.createElement('canvas')
    this.canvasContext = this.canvasNode.getContext('2d')
  }

  get context () {
    return PageView.context
  }

  get pageNumber () {
    return this.index + 1
  }

  async init () {
    this.pageSize = await this.context.worker.getPageSize(this.index)
		this.rootNode.appendChild(this.canvasNode)

    this.updateSize()
  }

  private updateSize () {
    this.rootNode.style.width = `${((this.pageSize.width * this.zoom) / 72) | 0}px`
    this.rootNode.style.height = `${((this.pageSize.height * this.zoom) / 72) | 0}px`
    this.canvasNode.style.width = `${((this.pageSize.width * this.zoom) / 72) | 0}px`
    this.canvasNode.style.height = `${((this.pageSize.height * this.zoom) / 72) | 0}px`
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

  async getPageSize (): Promise<{ width: number, height: number}> {
    return await this.context.worker.getPageSize(this.index)
  }

  async renderToCanvas () {
    this.isRendered = true

    const page = this.index ?? this.context.options.page
    const canvas = await this.context.worker.getCanvasPixels(page, this.zoom * devicePixelRatio)
    
    this.canvasNode.width = canvas.width
    this.canvasNode.height = canvas.height
    this.canvasContext?.putImageData(canvas, 0, 0)

    this.context.oniPDF.emit(EVENTS.RENDERED, { page })
  }

  async renderToImage () {
    this.isRendered = true
    
    const page = this.index ?? this.context.options.page
    const z = devicePixelRatio * 96 / 72
    const pixmapImage = await this.context.worker.getPixmapImage(this.index, z)
    
    const image = new Image()
    image.src = URL.createObjectURL(new Blob([pixmapImage], { type: 'image/png' }))
    image.style.width = '100%'
    
    this.context.oniPDF.emit(EVENTS.RENDERED, { page })
    
    return image
  }
}

export const createPageView = (index: number) => provider(async (context) => {
  PageView.context = context
  const pageView = new PageView(index)
  
  await pageView.load()
  await pageView.init()

  return pageView
})
