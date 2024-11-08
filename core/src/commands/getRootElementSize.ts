import type { GlobalContext } from '../provider'

export const getRootElementSize = (context: GlobalContext) => () => {
  const rootRect = context.rootElement.getBoundingClientRect()
  const rootWidth = rootRect.width
  const rootHeight = rootRect.height

  return {
    width: rootWidth,
    height: rootHeight
  }
}
