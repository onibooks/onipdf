import { EVENTS } from '../constants'
// import { renderPageToImage } from '../presentation/rendering'
import { GlobalContext } from '../provider'

export const renderToImage = (context: GlobalContext) => async (index: number = 0) => {
  const pageNumber = context.options.page! 
  // const drawPromise = await context.pages[pageNumber].imageData

  // context.oniPDF.emit(EVENTS.RENDERED, { drawPromise })
}