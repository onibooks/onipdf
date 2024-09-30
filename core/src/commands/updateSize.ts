import type { GlobalContext } from '../provider'

export const updateSize = (context: GlobalContext) => async (index: number = 0) => {
  const pageView = context.pageViews[index]
  const pageSize = await pageView.getPageSize()

  // const width = pageSize.width * pageView.zoom / 72 | 0
  // const height = pageSize.width * pageView.zoom / 72 | 0
  
  // return {
  //   width,
  //   height
  // }
}