import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

// flow, spread 상태관리
// 페이지의 width, height

export type LayoutOptions = {
  width?: number
  height?: number
  flow?: 'paginated' | 'scrolled'
  spread?: 'single' | 'double' | 'coverFacing'
}

export type Layout = LayoutOptions & {
  divisor: number
  pageWidth: number
  pageHeight: number
  contentWidth: number
  contentHeight: number
}

export const createLayout = () => provider((context) => {
  const layout = createStore(
    subscribeWithSelector<Layout>(() => ({
      divisor: 0,
      pageWidth: 0,
      pageHeight: 0,
      contentWidth: 0,
      contentHeight: 0
    }))
  )

  layout.subscribe((options) => options.flow)

  const configure = (
    options: Layout
  ) => {
    if (options.spread === 'single') {
      options.divisor = 1
    } else if (options.spread === 'double') {
      options.divisor = 2
    }

    return options
  }

  return (
    options?: LayoutOptions
  ): Layout => {
    if (options) {
      const prevOptions = layout.getState()
      const nextOptions = configure({
        ...prevOptions,
        ...options
      })

      layout.setState(nextOptions)
    }

    return layout.getState()
  }
})
