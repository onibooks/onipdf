import { createStore } from 'zustand/vanilla'

import { subscribeWithSelector } from 'zustand/middleware'

export type Sangte = {
  isLoad: boolean
  isResize: boolean
  isScroll: boolean
  isRendered: boolean
  scale: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    isResize: false,
    isScroll: false,
    isRendered: false,
    scale: 1
  }))

  return sangte
}
