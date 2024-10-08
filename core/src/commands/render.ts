import createEmotion from '@emotion/css/create-instance'
import { h, render as prender } from 'preact'
import { warn } from '../helpers'
import OniPdf from '../components/OniPdf'

import type { GlobalContext } from '../provider'
import type { LayoutOptions } from '../rendition/layout/createLayout'

export type Options = {
  type?: 'image' | 'canvas' | 'svg'
  page?: number
  zoom?: number
  layout?: LayoutOptions
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
      key: `onipdf`,
      container: element,
    })
    context.options = {
      ...options,
      page,
      type
    }
    
    const zoomValue = context.options.zoom ?? 1
    // 전반적인 뼈대를 먼저 설정
    context.pageViews.forEach((pageView) => pageView.setZoom(zoomValue))
    
    const fragment = document.createElement('div')
    const Component = h(OniPdf, { context })
    prender(Component, fragment)
    
    element.appendChild(fragment.firstChild as HTMLElement)
  }
}
