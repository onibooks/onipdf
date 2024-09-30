import type { GlobalContext } from '../provider'
import type { LayoutOptions } from '../presentation/layout/createLayout'

export const layout = (context: GlobalContext) => (options?: LayoutOptions) => {
  const { presentation } = context

  return presentation.layout(options)
}