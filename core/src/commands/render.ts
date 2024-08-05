import type { GlobalContext } from '../provider'

export const render = (context: GlobalContext) => async (index: number = 0) => {
  const data = await context.oniPDF.loadPage(index)
  
  console.log('render: ', data)
}
