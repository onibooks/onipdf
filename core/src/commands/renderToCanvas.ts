import type { GlobalContext } from '../provider'

export const renderToCanvas = (context: GlobalContext) => async (index: number) => {
  const pageView = context.pageViews[index]

  if (!pageView.isLoad) {
    await pageView.load()
  }

  return pageView.renderToCanvas()
}
