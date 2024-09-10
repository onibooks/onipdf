import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'

// 현재 위치와 페이지정보에 대해서 관리

export type LocateOptions = {
  currentPage?: number
}

export type Locate = Required<LocateOptions> & {
  totalPages: number,
  chapterIndex: number,
  chapterTitle: string
}

export const createLocate = () => provider((context) => {
  const locate = createStore()
})