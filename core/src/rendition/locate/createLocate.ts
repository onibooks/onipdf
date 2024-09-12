import { provider } from '../../provider'
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

// 현재 위치와 페이지정보에 대해서 관리

export type LocateOptions = {
  currentPage?: number
}

export type Locate = LocateOptions & {
  totalPages: number,
  chapterIndex: number,
  chapterTitle: string
}

export const createLocate = () => provider((context) => {
  const locate = createStore(
    subscribeWithSelector<Locate>(() => ({
      totalPages: 0,
      chapterIndex: 0,
      chapterTitle: ''
    }))
  )

  const configure = (
    options: Locate
  ) => {
    return options
  }

  return (
    options?: LocateOptions
  ): Locate => {
    if (options) {
      const prevOptions = locate.getState()
      const nextOptions = configure({
        ...prevOptions,
        ...options
      })

      locate.setState(nextOptions)
    }

    return locate.getState()
  }
})