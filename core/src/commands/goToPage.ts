import type { GlobalContext } from '../provider'

export const goToPage = (context: GlobalContext) => (index: number = 0) => {
  const { presentation } = context
  const { rootWidth } = presentation.layout()

  if (presentation.layout().flow === 'paginated') {
    requestAnimationFrame(() => context.documentElement.scrollLeft = index * rootWidth)
  }
}
