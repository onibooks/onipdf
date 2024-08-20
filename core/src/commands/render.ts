import createEmotion from '@emotion/css/create-instance'
import { h, render as prender } from 'preact'
import OniPdf from '../components/OniPdf'
import { warn } from '../helpers'

import type { GlobalContext } from '../provider'

export type Options = {
  type?: 'image' | 'canvas' | 'svg'
  page?: number
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

    const { type = 'canvas', page = 0 } = options || {}
    
    context.rootElement = element
    context.emotion = createEmotion({
      key: `onipdff`,
      container: element,
    })
    context.options = {
      ...options,
      page,
      type
    }

    if (!context.loaded) {
      await context.oniPDF.loadPage(page)
    }

    const fragment = document.createElement('div')
    const Component = h(OniPdf, { context })
    prender(Component, fragment)
  
    element.appendChild(fragment.firstChild as HTMLElement)
  }
}
