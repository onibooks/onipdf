import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { EVENTS } from '../../constants'

// 현재 위치와 페이지정보에 대해서 관리

export type LocateOptions = {
  currentPage?: number
  totalPages?: number
}

export type Locate = LocateOptions & {
  
}

export const createLocate = () => provider((context) => {
  const locate = createStore(
    subscribeWithSelector<Locate>(() => ({
      currentPage: -1,
      totalPages: 0
    }))
  )

  locate.subscribe(
    (options) => options.currentPage,
    (pageNumber) => {
      moveToPage(pageNumber!)
    }
  )

  const moveToPage = (pageNumber: number) => {
    const { presentation, documentElement } = context
    const {
      flow,
      rootWidth,
      rootHeight
    } = presentation.layout()

    if (flow === 'paginated') {
      documentElement.scrollLeft = pageNumber * rootWidth
    } else if (flow === 'scrolled') {
      console.log(123123, pageNumber, rootHeight)
      documentElement.scrollTop = pageNumber * rootHeight
    }
  }
  
  const getCurrentPage = () => {
    const { documentElement } = context
    const {
      flow,
      rootWidth
    } = context.presentation.layout()

    if (flow === 'paginated') {
      const { scrollLeft } = documentElement
      const currentPage = Math.round(scrollLeft / rootWidth)
      
      return currentPage
    } else {
      // offset으로 설정하기
      const { currentPage } = locate.getState()
      
      return currentPage
    }
  }
  
  const handleRelocate = (event?: Event) => {
    const currentPage = getCurrentPage()
    console.log('currentPage', currentPage)

    locate.setState({
      currentPage
    })
    
    if (event) {
      context.oniPDF.emit(EVENTS.RELOCATE)
    }
  }
  
  const handleResize = (event?: Event) => {
    const { isRendered } = context.sangte.getState()
    if (!isRendered) return

    const { currentPage } = locate.getState()
    moveToPage(currentPage!)
  }

  context.oniPDF.on(EVENTS.SCROLL, handleRelocate)
  context.oniPDF.on(EVENTS.RESIZE, handleResize)

  const configure = (
    options: Locate
  ) => {
    return options
  }
  return (
    options?: LocateOptions
  ): Locate => {
    if (options) {
      const prevOptions = locate.getState()
      const nextOptions = configure({
        ...prevOptions,
        ...options
      })

      locate.setState(nextOptions)
    }

    return locate.getState()
  }
})