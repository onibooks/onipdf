import { addClass, removeClass } from '../../utils'
import { EVENTS } from '../../constants'

import type { GlobalContext } from '../../provider'
import type { LayoutOptions } from './createLayout'

export const setFlow = (context: GlobalContext) => (value: LayoutOptions['flow']) => {
  const { oniPDF, documentElement, sangte } = context

  removeClass(documentElement, 'paginated')
  removeClass(documentElement, 'scrolled')
  addClass(documentElement, value!)

  // const { isRendered } = sangte.getState()
  // if (isRendered) {
  //   sangte.setState({
  //     isRendered: false
  //   })
  // }

  // const resizeEvent = new Event('resize')
  // window.dispatchEvent(resizeEvent)

  oniPDF.forceReflow()
}