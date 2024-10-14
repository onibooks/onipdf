import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => async (index: number = 0) => {
  const pageView = context.pageViews[index]
  const { height } = pageView.rootPageSize

  console.log(index, index * Math.floor(height)) // 스크롤 영역 찾기...
  
  context.documentElement.scrollTop = index * Math.floor(height)
}
