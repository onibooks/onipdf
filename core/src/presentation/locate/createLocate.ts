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
    (value) => {
      moveToPage(value!)
    }
  )

  const moveToPage = (value: number) => {
    if (value > 0) {
      const { presentation, documentElement } = context
      const {
        flow,
        rootWidth
      } = presentation.layout()
  
      if (flow === 'paginated') {
        setTimeout(() => {
          requestAnimationFrame(() => documentElement.scrollLeft = value * rootWidth)
        }, 1000)
      } else if (flow === 'scrolled') {
        // requestAnimationFrame(() => documentElement.scrollTop = value * pageHeight)
      }
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
    }
  }
  
  const handleRelocate = (event?: Event) => {
    const currentPage = getCurrentPage()
    
    locate.setState({
      currentPage,
    })
    
    if (event) {
      context.oniPDF.emit(EVENTS.RELOCATE)
    }
  }
  
  const handleResize = (event?: Event) => {
    const { currentPage } = locate.getState()
    moveToPage(currentPage!)
  }

  context.oniPDF.on(EVENTS.SCROLL, handleRelocate)
  context.oniPDF.on(EVENTS.RESIZE, handleResize)
  context.oniPDF.on(EVENTS.RENDERED, handleResize)

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