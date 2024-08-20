import { createStore } from 'zustand/vanilla'

export type Sangte = {}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    
  }))

  return sangte
}