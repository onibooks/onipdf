import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => (index: number = 0) => {
  const { pageViews } = context
  const pageView = pageViews[index]
  const { height } = pageView.rootPageSize

  requestAnimationFrame(() => context.rootElement.scrollTop = index * height)
}
