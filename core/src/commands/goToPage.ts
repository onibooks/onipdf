import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => async (index: number = 0) => {
  const pageView = context.pageViews[index]
  const pageHeight = (pageView.pageSize.height * context.zoom) / 72
  
  context.scrollingElement.scrollTop = index * Math.floor(pageHeight)
}