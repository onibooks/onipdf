import { createStore } from 'zustand/vanilla'
import { PageView } from './documents/createPageView'

export type Sangte = {
  isLoad: boolean
  currentIndex: number
  scale: number
  pageViewSections: PageView[]
  renderedPageViews: PageView[]
}

export const createSangte = () => {
  const sangte = createStore<Sangte>((set) => ({
    isLoad: false,
    currentIndex: 0,
    scale: 1,
    pageViewSections: [],
    renderedPageViews: []
  }))

  return sangte
}
