import { provider } from '../provider'

let scrollRatio = 0

export const updateScrollRatio = () => provider((context) => {
  const { flow } = context.presentation.layout()

  if (flow === 'scrolled') {
    const { scrollTop, scrollHeight } = context.documentElement
    scrollRatio = scrollTop / scrollHeight || 0
  }

  return scrollRatio
})