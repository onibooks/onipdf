import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => (index: number = 0) => {
  // const { pageViews, presentation } = context
  // const pageView = pageViews[index]
  // const { width, height } = pageView.rootPageSize

  // if (presentation.layout().flow === 'paginated') {
  //   requestAnimationFrame(() => context.documentElement.scrollLeft = index * width)
  // } else {
  //   requestAnimationFrame(() => context.documentElement.scrollTop = index * height)
  // }
  const { presentation } = context
  const { rootWidth } = presentation.layout()

  if (presentation.layout().flow === 'paginated') {
    requestAnimationFrame(() => context.documentElement.scrollLeft = index * rootWidth)
  }
}
