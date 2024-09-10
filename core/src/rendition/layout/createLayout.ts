import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'

// single, double 같은 상태관리, 페이지의 width, height
// 스크롤모드 / 페이지모드

export type LayoutOptions = {
  width?: number
  height?: number
}

export type Layout = LayoutOptions & {
  name: string
  divisor: number
  pageWidth: number
  pageHeight: number
  contentWidth: number
  contentHeight: number
}

export const createLayout = () => provider((context) => {
  const layout = createStore()
})