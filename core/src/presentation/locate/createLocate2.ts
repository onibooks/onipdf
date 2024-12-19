// 현재 위치와 페이지정보에 대해서 관리

import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { EVENTS } from '../../constants'

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
      const { isResize } = context.sangte.getState()
      // if (!isResize) {
        documentElement.scrollLeft = currentPage * rootWidth 
      // }
    } else if (flow === 'scrolled') {
      const { isScroll, isResize } = context.sangte.getState()
      // if (!isScroll && !isResize) {
        documentElement.scrollTop = context.pageViews[currentPage]?.rect.top
      // }
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
    const { totalPages } = locate.getState()
    const pageSizes = context.pageViews
    
    for (let i = 0; i < pageSizes.length; i++) {
      const currentPageTop = pageSizes[i]?.rect.top !== undefined 
      ? Math.round(pageSizes[i].rect.top * 10) / 10
      : 0
      const nextPageTop = pageSizes[i + 1]?.rect.top !== undefined
      ? Math.round(pageSizes[i + 1].rect.top * 10) / 10
      : Math.round(pageSizes[totalPages! - 1].rect.top * 10) / 10
      
      if (scrollTop >= currentPageTop && scrollTop < nextPageTop) {
        return i
      }
    }

    return pageSizes.length - 1
  }

  const handleRelocate = (event?: Event) => {
    const isForceReflow = event && (event as Event & { isForceReflow?: boolean }).isForceReflow
    const isForceLayout = event && (event as Event & { isForceLayout?: boolean }).isForceLayout 
    if (isForceReflow) return
    // if (isForceReflow || isForceLayout) return

    const { isRendered } = context.sangte.getState()
    if (!isRendered) return

    const currentPage = getCurrentPage()
    locate.setState({
      currentPage
    })
  }
  
  const handleResize = (event?: Event) => {
    const { isRendered } = context.sangte.getState()
    if (!isRendered) return

    handleRelocate(event)
  }

  const handleLayout = (event?: Event) => {
    // Double 일 때, 
    // 뷰포트 크기 작게 줄였을 때
    // 업데이트 후 갱신된 currentPage보다 하나 작게 currentPage를 가지고 오는 버그 있음...
    // 원인은 아마 handleRelocate에서 getCurrentPage() 계산되는 부분인 것 같은데..
    
    const { currentPage: prevPage } = locate.getState()
    const { spread } = context.presentation.layout()

    if (spread !== 'single') {
      locate.setState({
        currentPage: Math.floor(prevPage! / 2)
      })
    } else {
      locate.setState({
        currentPage: Math.floor(prevPage! * 2)
      })
    }

    const { currentPage } = locate.getState()
    console.log('업데이트 후', currentPage!)

    if (event) {
      context.oniPDF.emit(EVENTS.RENDER)
    }
  }

  context.oniPDF.on(EVENTS.RESIZE, handleResize)
  context.oniPDF.on(EVENTS.LAYOUT, handleLayout)
  // EVENTS.SCROLL 이벤트일 때 handleRelocate 실행하고 싶은데
  // getCurrentPage() 자체는 올바른 currentPage를 가지고 오지만, currentPage가 갱신되면서 moveToPage가 실행될 때 뭔가 꼬이는지 망함
  // 근데 scroll 될 때마다 현재 페이지 갱신되게 해야하는데 이게 진짜 노답이라 죽겠음

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