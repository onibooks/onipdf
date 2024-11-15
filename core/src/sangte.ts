import { createStore } from 'zustand/vanilla'
import { PageView } from './documents/createPageView'

export type Sangte = {
  isLoad: boolean
  currentIndex: number
  scale: number
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    currentIndex: 0,
    scale: 1,
  }))

  // currentIndex가 바뀔때마다 실행될 구독함수..필요

  return sangte
}
