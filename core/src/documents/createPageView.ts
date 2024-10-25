import { EVENTS } from '../constants'
import { provider, type GlobalContext } from '../provider'
import { addStyles } from '../utils'

type PageSize = {
  width: number,
  height: number
}

export class PageView {
  static context: GlobalContext
  public index: number
  public rootPageSize: PageSize
  public pageSize: PageSize
  public canvasSize: PageSize
  public scaledSize: PageSize
  public pageSection: HTMLElement
  public pageContainer: HTMLElement
  public canvas: ImageData
  public canvasNode: HTMLCanvasElement
  public canvasContext: CanvasRenderingContext2D | null
  public isLoad = false
  public isRendered = false
  public currentScale: number

  constructor (index: number) {
    this.index = index
    
    this.pageSection = this.createElement('div', 'pageSection', 'pageSection' + (this.index + 1))
    this.pageContainer = this.createElement('div', 'pageContainer', 'pageContainer' + (this.index + 1))
    this.pageContainer.innerText = String(this.index)
    this.pageSection.appendChild(this.pageContainer)
        
    this.canvasNode = this.createElement('canvas', 'canvasNode', 'canvasNode' + (this.index + 1)) as HTMLCanvasElement
    this.canvasContext = this.canvasNode.getContext('2d')
    // this.pageSection.appendChild(this.canvasNode)

    this.applyStyles()
  }

  get context () {
    return PageView.context
  }

  get pageNumber () {
    return this.index + 1
  }

  async init () {
     // 1. 기본 pdf 페이지 사이즈 받아오기
    this.pageSize = await this.getPageSize()
    
    // 2. 사용자가 지정해서 넘겨준 scale에 맞게 페이지 사이즈 설정
    const { scale } = this.context.sangte.getState()
    this.currentScale = scale
    
    this.scaledSize = { 
      width: this.pageSize.width * scale,
      height: this.pageSize.height * scale
    }
    
    // 3. root 사이즈에 맞게 화면 크기 설정
    // 주의할 점은 resize될 때 같이 반응되어야 한다는 점..
    const rootRect = this.context.rootElement.getBoundingClientRect()
    const rootWidth = rootRect.width
    const rootHeight = rootRect.height
    
    const pageWidthScale = rootWidth / this.scaledSize.width
    const pageHeightScale = rootHeight / this.scaledSize.height
    
    const minRootScale = Math.min(pageWidthScale, pageHeightScale)

    this.rootPageSize = {
      width: this.scaledSize.width * (scale === 1 ? minRootScale : 1),
      height: this.scaledSize.height * (scale === 1 ? minRootScale : 1)
    }

    this.canvasSize = {
      width: this.scaledSize.width * (scale === 1 ? minRootScale : 1),
      height: this.scaledSize.height * (scale === 1 ? minRootScale : 1)
    }
  
    // 4. 스타일 적용하기
    this.setSizeStyles(this.rootPageSize)
    this.setSizeStyles(this.canvasSize)
  }

  async updatePageSize () {
    const { scale } = this.context.sangte.getState()

    // 2. 사용자가 지정해서 넘겨준 scale에 맞게 페이지 사이즈 설정
    const updateScaledSize = {
      width: this.scaledSize.width * scale,
      height: this.scaledSize.height * scale
    }
    
    this.scaledSize = updateScaledSize
    
    const rootRect = this.context.rootElement.getBoundingClientRect()
    const rootWidth = rootRect.width
    const rootHeight = rootRect.height
    
    const pageWidthScale = rootWidth / this.scaledSize.width
    const pageHeightScale = rootHeight / this.scaledSize.height
    
    const minRootScale = Math.min(pageWidthScale, pageHeightScale)

    this.rootPageSize = {
      width: this.scaledSize.width * (scale === 1 ? minRootScale : 1),
      height: this.scaledSize.height * (scale === 1 ? minRootScale : 1)
    }

    this.setSizeStyles(this.rootPageSize)
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

  async drawPageAsPixmap () {
    try {
      if (this.isRendered) return 

      const page = this.index ?? this.context.options.page
      const zoom = this.context.sangte.getState().scale * 96

      const canvas = await this.context.worker.getCanvasPixels(page, zoom * devicePixelRatio)
      if (!canvas) {
        throw new Error('Fail getCanvasPixels')
      }
      
      this.canvasNode.width = canvas.width
      this.canvasNode.height = canvas.height
      if (this.canvasContext) {
        this.canvasContext.putImageData(canvas, 0, 0)
      }

      this.canvas = canvas

      this.isRendered = true
    } catch (error) {
      console.error('Error rendering to canvas:', error)
    }
  }

  restoreCanvasSize () {
    this.canvasNode.width = this.canvas.width
    this.canvasNode.height = this.canvas.height

    if (this.canvasContext) {
      this.canvasContext.putImageData(this.canvas, 0, 0)
    }
  }

  clearCanvasSize () {
    this.canvasNode.width = 0
    this.canvasNode.height = 0
  }

  async getPageSize (): Promise<{ width: number, height: number}> {
    return await this.context.worker.getPageSize(this.index)
  }

  private setSizeStyles (size: PageSize) {
    const divisor = this.context.options.layout?.spread !== 'single' ? 2 : 1
    // 이게 아니라 전체 화면에서 절반 사이즈를 구해야한다...
    const divisorSize = {
      width: size.width / divisor,
      height: size.height / divisor
    }

    addStyles(this.pageSection, {
      width: `${divisorSize.width}px`,
      height: `${divisorSize.height}px`,
      // width: `${size.width}px`,
      // height: `${size.height}px`,
    })

    addStyles(this.pageContainer, {
      width: `${divisorSize.width}px`,
      height: `${divisorSize.height}px`,
    })

    addStyles(this.canvasNode, {
      width: `${divisorSize.width}px`,
      height: `${divisorSize.height}px`,
    })
  }

  private createElement (element: keyof HTMLElementTagNameMap, className: string, id: string): HTMLElement {
    const elem = document.createElement(element)
    elem.className = className
    elem.id = id
    elem.dataset.index = String(this.index)
    
    return elem
  }

  private applyStyles () {
    addStyles(this.pageSection, {
      float: 'left',
      position: 'relative',
    })

    addStyles(this.pageContainer, {
      position: 'relative',
      top: '0',
      margin: '0 auto',
    })

    addStyles(this.canvasNode, {
      position: 'absolute',
      top: '0',
      left: '0'
    })
  }
}

export const createPageView = (index: number) => provider(async (context) => {
  PageView.context = context
  
  const pageView = new PageView(index)
  await pageView.load()

  return pageView
})
