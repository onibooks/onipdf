import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => async (index: number = 0) => {
  const pageView = context.pageViews[index]
  const pageHeight = pageView.rootPageSize.height
  
  context.documentElement.scrollTop = index * Math.floor(pageHeight)
}
