import { provider } from '../provider'
import { EVENTS } from '../constants'

let scrollPosition = { leftRatio: 0, topRatio: 0 }

export const updateScrollPosition = () => provider((context) => {
  const { flow } = context.presentation.layout()

  if (flow === 'scrolled') {
    const { scrollTop, scrollHeight } = context.documentElement
    scrollPosition = {
      leftRatio: 0,
      topRatio: scrollTop / scrollHeight || 0
    }
  } else {
    const { scrollLeft, scrollWidth } = context.documentElement
    scrollPosition = {
      leftRatio: scrollLeft / scrollWidth || 0,
      topRatio: 0
    }
  }

  return scrollPosition
})