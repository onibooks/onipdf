import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

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
    const { flow } = context.presentation.layout()

    if (flow === 'paginated') {
      setScrollLeft(value)
    } else {
      setScrollTop(value)
    }
  }

  const setScrollLeft = (value: number) => {
    const { presentation } = context
    const { rootWidth } = presentation.layout()

    if (presentation.layout().flow === 'paginated') {
      requestAnimationFrame(() => context.documentElement.scrollLeft = value * rootWidth)
    }
  }

  const setScrollTop = (value: number) => {
    // 모든 페이지의 높이 값이 다를 수 있기 때문에 고려해주어야 한다.
    const currentPage = context.documentElement.querySelector(`[data-index="${value}"]`)! as HTMLElement
    context.documentElement.scrollTop = currentPage.offsetTop
  }
  
  const getCurrentPage = () => {
    const { documentElement } = context
    const {
      flow,
      rootWidth
    } = context.presentation.layout()

  }

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