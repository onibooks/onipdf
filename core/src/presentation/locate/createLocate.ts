// 현재 위치와 페이지정보에 대해서 관리

import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { EVENTS } from '../../constants'

type Size = {
  width: number
  height: number
}

export type LocateOptions = {
  currentPage?: number
  totalPages?: number
}

export type Locate = LocateOptions & {}

export const createLocate = () => provider((context) => {
  let lastPage = 0
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
  
  const getValidPageNumber = (pageNumber: number) => {
    const { totalPages } = locate.getState()
    if (isNaN(pageNumber) || pageNumber === undefined || totalPages === undefined) {
      return lastPage
    }
  
    return lastPage = Math.min(Math.max(0, Math.floor(pageNumber)), totalPages - 1)
  }

  const moveToPage = (pageNumber: number) => {
    const currentPage = getValidPageNumber(pageNumber)

    const { presentation, documentElement } = context
    const {
      flow,
      rootWidth
    } = presentation.layout()
    
    if (flow === 'paginated') {
      documentElement.scrollLeft = currentPage * rootWidth
    } else if (flow === 'scrolled') {
      const { isScroll, isResize } = context.sangte.getState()
      if (!isScroll) {
        documentElement.scrollTop = context.pageSizes[currentPage]?.top
      }
    }
  }

  const getCurrentPage = () => {
    const { flow } = context.presentation.layout()
  
    return flow === 'paginated'
      ? getPaginatedCurrentPage()
      : getScrolledCurrentPage()
  }
  
  const getPaginatedCurrentPage = () => {
    const { documentElement, presentation, sangte } = context
    const { scrollLeft } = documentElement
    const { rootWidth } = presentation.layout()
    const currentPage = Math.round(scrollLeft / rootWidth)
    
    const { isResize } = sangte.getState()
    if (isResize) {
      moveToPage(currentPage)
    }

    return currentPage
  }
  
  const getScrolledCurrentPage = () => {
    const { documentElement } = context
    const { scrollTop } = documentElement
    const pageSizes = context.pageSizes
    
    for (let i = 0; i < pageSizes.length; i++) {
      const currentPageTop = Math.round(pageSizes[i].top) * 10 / 10
      const nextPageTop = Math.round(pageSizes[i + 1]?.top) * 10 / 10
      
      if (scrollTop >= currentPageTop && scrollTop < nextPageTop) {
        return i
      }
    }
  }

  const handleRelocate = (event?: Event) => {
    const { isRendered } = context.sangte.getState()
    if (!isRendered) return

    const currentPage = getCurrentPage()
    locate.setState({
      currentPage
    })

    if (event) {
      context.oniPDF.emit(EVENTS.RELOCATE)
    }
  }

  const handleScroll = (event?: Event) => {
    const currentPage = getCurrentPage()
    locate.setState({
      currentPage
    })
    console.log('handleScroll', currentPage)

    if (event) {
      context.oniPDF.emit(EVENTS.SCROLL)
    }
  }
  
  const handleResize = (event?: Event) => {
    const { isRendered } = context.sangte.getState()
    if (!isRendered) return

    handleRelocate()
  }

  context.oniPDF.on(EVENTS.RESIZE, handleResize)
  context.oniPDF.on(EVENTS.SCROLL, handleScroll)

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