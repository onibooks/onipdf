import { createStore } from 'zustand/vanilla'

export type Sangte = {
  isLoad: boolean
  currentIndex: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    currentIndex: 0
  }))

  return sangte
}
