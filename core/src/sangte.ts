import { createStore } from 'zustand/vanilla'

export type Sangte = {
  isLoad: boolean
  currentIndex: number
  scale: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    currentIndex: 0,
    scale: 1
  }))

  return sangte
}
