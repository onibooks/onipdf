import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => (index: number = 0) => {
  const { pageViews, presentation } = context
  const pageView = pageViews[index]
  const { width, height } = pageView.rootPageSize

  if (presentation.layout().flow === 'paginated') {
    requestAnimationFrame(() => context.rootElement.scrollLeft = index * width)
  } else {
    requestAnimationFrame(() => context.rootElement.scrollTop = index * height)
  }
}
