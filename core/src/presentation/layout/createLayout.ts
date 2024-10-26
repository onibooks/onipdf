import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

import * as commands from './index'
import { provider } from '../../provider'

export type LayoutOptions = {
  flow?: 'paginated' | 'scrolled'
  spread?: 'single' | 'double' | 'coverFacing' 
  zoom?: number
}

export type Layout = LayoutOptions & {
  divisor: number
}

export const createLayout = () => provider((context) => {
  const layout = createStore(
    subscribeWithSelector<Layout>(() => ({
      divisor: 0,
      flow: 'scrolled',
      spread: 'single',
      zoom: 1
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
    if (options.spread === 'single') {
      options.divisor = 1
    } else if (options.spread === 'double') {
      options.divisor = 2
    } else if (options.spread === 'coverFacing') {
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
