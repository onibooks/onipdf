import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

import * as commands from './index'
import { provider } from '../../provider'

export type LayoutOptions = {
  width?: number
  height?: number
  totalWidth?: number
  totalHeight?: number
  flow?: 'paginated' | 'scrolled'
  spread?: 'single' | 'double' | 'coverFacing' 
  zoom?: number
}

export type Layout = LayoutOptions & {
  divisor: number
  rootWidth: number
  rootHeight: number
  totalWidth: number
  totalHeight: number
}

export const createLayout = () => provider((context) => {
  const layout = createStore(
    subscribeWithSelector<Layout>(() => ({
      divisor: 0,
      zoom: -1,
      rootWidth: -1,
      rootHeight: -1,
      totalWidth: -1,
      totalHeight: -1,
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
    const totalWidth = options.totalWidth || 0
    const totalHeight= options.totalHeight || 0
    
    if (options.spread === 'single') {
      options.divisor = 1
    } else if (options.spread === 'double') {
      options.divisor = 2
    } else if (options.spread === 'coverFacing') {
      options.divisor = 2
    }
    
    options.rootWidth = width
    options.rootHeight = height
    
    options.totalWidth = totalWidth
    options.totalHeight = totalHeight

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
