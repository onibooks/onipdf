import { createStore } from 'zustand/vanilla'

export type Sangte = {
  isLoad: boolean
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false
  }))

  return sangte
}
