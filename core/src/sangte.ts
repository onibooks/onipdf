import { createStore } from 'zustand/vanilla'
import { PageView } from './documents/createPageView'

export type Sangte = {
  isLoad: boolean
  isRendered: boolean
  scale: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    isRendered: false,
    scale: 1
  }))

  return sangte
}
