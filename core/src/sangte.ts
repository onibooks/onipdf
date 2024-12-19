import { createStore } from 'zustand/vanilla'

export type Sangte = {
  isLoad: boolean
  isResize: boolean
  isScroll: boolean
  isReady: boolean
  isRendered: boolean
  scale: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    isResize: false,
    isScroll: false,
    isReady: false,
    isRendered: false,
    scale: 1
  }))

  return sangte
}
