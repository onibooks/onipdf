import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => (index: number = 0) => {
  const { pageViews, sangte } = context

  // const { pageViewSections }  = sangte.getState()

  const pageView = pageViews[index]
  const { height } = pageView.rootPageSize

  requestAnimationFrame(() => context.rootElement.scrollTop = index * height)

  // const targetPageIndex = pageViewSections.findIndex((view) => view.index === index)
  
  // requestAnimationFrame(() => context.rootElement.scrollTop = targetPageIndex * height)
}
