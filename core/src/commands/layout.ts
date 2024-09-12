import type { GlobalContext } from '../provider'
import type { LayoutOptions } from '../rendition/layout/createLayout'

export const layout = (context: GlobalContext) => (options?: LayoutOptions) => {
  const { rendition } = context

  console.log('rendition: ', options)

  return rendition.layout(options)
}