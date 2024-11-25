import createEmotion from '@emotion/css/create-instance'
import { h, render as prender } from 'preact'
import { warn } from '../helpers'
import { EVENTS } from '../constants'

// import OniPDF from '../components/OniPdf2'
import OniPDF from '../components/OniPDF3'

import type { GlobalContext } from '../provider'
import type { LayoutOptions } from '../presentation/layout/createLayout'
import type { LocateOptions } from '../presentation/locate/createLocate'

export type Options = {
  zoom?: number
  layout?: LayoutOptions
  locate?: LocateOptions
}

export const render = (context: GlobalContext) => {
  let rendered = false
  
  return async (
    element: HTMLElement,
    options?: Options
  ) => {
    if (rendered) {
      return warn(
        `이미 렌더링 되어 있습니다.\n ` +
        `다시 렌더링 하려면 destroy() 호출 후 새로운 인스턴스를 생성하세요.`
      )
    }
    rendered = true
    
    context.rootElement = element

    context.emotion = createEmotion({
      key: `onipdf`,
      container: element,
    })

    context.options = {
      ...options
    }

    const fragment = document.createElement('div')
    const Component = h(OniPDF, { context })
    prender(Component, fragment)
    
    element.appendChild(fragment.firstChild as HTMLElement)

    // context.oniPDF.emit(EVENTS.RENDERED)
  }
}
