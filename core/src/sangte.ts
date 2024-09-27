import { createStore } from 'zustand/vanilla'

export type Sangte = {
  isLoad: boolean
  currentIndex: number
  cachedScale: number | null
  cachedRootRect: DOMRect | null
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    currentIndex: 0,
    cachedScale: null,
    cachedRootRect: null
  }))

  return sangte
}
