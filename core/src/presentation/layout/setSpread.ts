import { addClass, removeClass } from '../../utils'

import type { GlobalContext } from '../../provider'
import type { LayoutOptions } from './createLayout'

export const setSpread = (context: GlobalContext) => (value: LayoutOptions['spread']) => {
  const { oniPDF, documentElement } = context

  removeClass(documentElement, 'single')
  removeClass(documentElement, 'double') 
  removeClass(documentElement, 'coverFacing') 
  addClass(documentElement, value!)

  oniPDF.forceLayout()
}