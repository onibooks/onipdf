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
  public zoom: number
  public pageSize: PageSize
  public pageSection: HTMLDivElement
  public pageContainer: HTMLDivElement
  public isLoad = false
  public isRendered = false

  constructor (index: number) {
    this.index = index
    this.zoom = this.convertPercentageToDPI(1)

    this.pageSection = document.createElement('div')
		this.pageSection.id = 'pageSection' + (this.index + 1)
		this.pageSection.dataset.index = String(this.index)
		this.pageSection.className = 'pageSection'

    this.pageContainer = document.createElement('div')
		this.pageContainer.id = 'pageContainer' + (this.index + 1)
		this.pageContainer.dataset.index = String(this.index)
		this.pageContainer.className = 'pageContainer'

    this.pageSection.appendChild(this.pageContainer)

    addStyles(this.pageSection, {
      float: 'left',
      position: 'relative'
    })

    addStyles(this.pageContainer, {
      position: 'relative',
      top: '0',
      margin: '0 auto'
    })
  }

  get context () {
    return PageView.context
  }

  get pageNumber () {
    return this.index + 1
  }  

  setZoom (zoomPercentage: number) {
    if (zoomPercentage < 0) zoomPercentage = 0.1
    if (zoomPercentage > 2) zoomPercentage = 2

    const newZoom = this.convertPercentageToDPI(zoomPercentage)

    if (this.zoom !== newZoom) {
      this.zoom = newZoom
    }
  }

  convertPercentageToDPI (scale: number = 1): number {
    const DPI = 96 // 100% 일 때 DPI는 96
    return DPI * scale
  }

  getViewport (): PageSize {
    const width = this.pageSize.width * (this.zoom / 96)
    const height = this.pageSize.height * (this.zoom / 96)

    return {
      width,
      height
    }
  }

  async init () {
    this.pageSize = await this.getPageSize()
    const { width: scaledWidth, height: scaledHeight } = this.getScaledSize()

    addStyles(this.pageSection, {
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`
    })

    addStyles(this.pageContainer, {
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`
    })
  }

  getScaledSize (): PageSize {
    const scale = this.getScale()
    const width = this.pageSize.width * scale
    const height = this.pageSize.height * scale

    return {
      width,
      height
    }
  }

  getScale (): number {
    const viewport = this.getViewport()
    const { sangte, rootElement } = this.context
    const { cachedRootRect, cachedScale } = sangte.getState()

    const rootRect = cachedRootRect || rootElement.getBoundingClientRect()
    if (!cachedRootRect) {
      sangte.setState({ cachedRootRect: rootRect })
    }

    const rootWidth = rootRect.width
    const rootHeight = rootRect.height
    
    const pageWidthScale = rootWidth / viewport.width
    const pageHeightScale = rootHeight / viewport.height

    const scale = Math.min(pageWidthScale, pageHeightScale)

    if (cachedScale !== scale) {
      sangte.setState({ cachedScale: scale })
    }

    return scale
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
}

export const createPageView = (index: number) => provider(async (context) => {
  PageView.context = context
  
  const pageView = new PageView(index)
  await pageView.load()

  return pageView
})
