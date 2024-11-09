import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

import * as commands from './index'
import { provider } from '../../provider'

export type LayoutOptions = {
  width?: number
  height?: number
  defaultPageWidth?: number
  defaultPageHeight?: number
  flow?: 'paginated' | 'scrolled'
  spread?: 'single' | 'double' | 'coverFacing' 
  zoom?: number
}

export type Layout = LayoutOptions & {
  divisor: number
  rootWidth: number
  rootHeight: number
  pageWidth: number
  pageHeight: number
}

export const createLayout = () => provider((context) => {
  const layout = createStore(
    subscribeWithSelector<Layout>(() => ({
      divisor: 0,
      flow: 'scrolled',
      spread: 'single',
      zoom: 1,
      rootWidth: 0,
      rootHeight: 0,
      pageWidth: 0,
      pageHeight: 0,
    }))
  )

  layout.subscribe(
    (options) => options.flow,
    commands.setFlow(context)
  )

  layout.subscribe(
    (options) => options.spread,
    commands.setSpread(context)
  )

  layout.subscribe(
    (options) => options.zoom,
    commands.setZoom(context)
  )

  const configure = (
    options: Layout
  ) => {
    const width = options.width || 0
    const height= options.height || 0
    const defaultPageWidth = options.defaultPageWidth || 0
    const defaultPageHeight = options.defaultPageHeight || 0

    if (options.spread === 'single') {
      options.divisor = 1
    } else if (options.spread === 'double') {
      options.divisor = 2
    } else if (options.spread === 'coverFacing') {
      options.divisor = 2
    }

    options.rootWidth = width
    options.rootHeight = height

    const { scale } = context.sangte.getState()
    const scaledPageWidth = defaultPageWidth * scale
    const scaledPageHeight = defaultPageHeight * scale

    console.log(defaultPageWidth)

    const pageWidth = width / scaledPageWidth
    const pageHeight = height / scaledPageHeight
    const minRootScale = Math.min(pageWidth, pageHeight)

    options.pageWidth = scaledPageWidth * (scale === 1 ? minRootScale : 1),
    options.pageHeight = scaledPageHeight * (scale === 1 ? minRootScale : 1)

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
