import { addClass, removeClass } from '../../utils'
import { EVENTS } from '../../constants'

import type { GlobalContext } from '../../provider'
import type { LayoutOptions } from './createLayout'

export const setFlow = (context: GlobalContext) => (value: LayoutOptions['flow']) => {
  console.log(context)
  const { oniPDF, documentElement } = context

  removeClass(documentElement, 'paginated')
  removeClass(documentElement, 'scrolled')
  addClass(documentElement, value!)

  oniPDF.emit(EVENTS.REFLOW)
}