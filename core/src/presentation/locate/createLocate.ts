import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { EVENTS } from '../../constants'

// 현재 위치와 페이지정보에 대해서 관리

export type LocateOptions = {
  currentPage?: number
}

export type Locate = LocateOptions & {
  totalPages: number
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
    const { presentation, documentElement } = context
    const {
      flow,
      rootWidth
    } = presentation.layout()

    if (flow === 'paginated') {
      requestAnimationFrame(() => documentElement.scrollLeft = value * rootWidth)
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
      currentPage
    })

    if (event) {
      context.oniPDF.emit(EVENTS.RELOCATE)
    }
  }

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