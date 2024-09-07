import type { GlobalContext } from '../provider'

export const loadPage = (context: GlobalContext) => async (index: number = 0) => {
  const pageView = context.pageViews[index]
  console.log(pageView)
  await pageView.load()

  return pageView
}
