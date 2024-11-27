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
      rootWidth
    } = presentation.layout()
    
    if (flow === 'paginated') {
      documentElement.scrollLeft = pageNumber * rootWidth
    } else if (flow === 'scrolled') {
      const { isResize } = context.sangte.getState()
      if (!isResize) {
        documentElement.scrollTop = context.pageSizes[pageNumber]?.top
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
    const { documentElement } = context
    const { rootWidth } = context.presentation.layout()
    const { scrollLeft } = documentElement

    return Math.round(scrollLeft / rootWidth)
  }
  
  const getScrolledCurrentPage = () => {
    const { documentElement } = context
    const { scrollTop } = documentElement
    const pageSizes = context.pageSizes
  
    for (let i = 0; i < pageSizes.length; i++) {
      const currentPageTop = pageSizes[i].top
      const nextPageTop = pageSizes[i + 1]?.top
  
      if (scrollTop >= currentPageTop && scrollTop < nextPageTop) {
        return i
      }
    }
  }

  const handleRelocate = (event?: Event) => {
    const currentPage = getCurrentPage()
    
    locate.setState({
      currentPage
    })
    moveToPage(currentPage!)
    
    if (event) {
      context.oniPDF.emit(EVENTS.RELOCATE)
    }
  }
  
  const handleResize = (event?: Event) => {
    const { isRendered } = context.sangte.getState()
    if (!isRendered) return
    
    handleRelocate()
  }

  context.oniPDF.on(EVENTS.RESIZE, handleResize)
  context.oniPDF.on(EVENTS.SCROLL, handleRelocate)

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