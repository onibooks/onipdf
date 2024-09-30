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
  public scaledSize: PageSize
  public pageSection: HTMLDivElement
  public pageContainer: HTMLDivElement
  public isLoad = false
  public isRendered = false

  constructor (index: number) {
    this.index = index
    
    this.pageSection = this.createDivElement('pageSection', 'pageSection' + (this.index + 1))
    this.pageContainer = this.createDivElement('pageContainer', 'pageContainer' + (this.index + 1))
    this.pageSection.appendChild(this.pageContainer)

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
    
    // 4. 스타일 적용하기
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

  async getPageSize (): Promise<{ width: number, height: number}> {
    return await this.context.worker.getPageSize(this.index)
  }

  private setSizeStyles (size: PageSize) {
    addStyles(this.pageSection, {
      width: `${size.width}px`,
      height: `${size.height}px`,
    })

    addStyles(this.pageContainer, {
      width: `${size.width}px`,
      height: `${size.height}px`,
    })
  }

  private createDivElement (className: string, id: string): HTMLDivElement {
    const div = document.createElement('div')
    div.className = className
    div.id = id
    div.dataset.index = String(this.index)
    
    return div
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
  }
}

export const createPageView = (index: number) => provider(async (context) => {
  PageView.context = context
  
  const pageView = new PageView(index)
  await pageView.load()

  return pageView
})
