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

    /*
      * 개선 필요 *
      documentElement를가 없어 layout과 locate에서 class를 설정해주는 부분이 오류가 난다.
    */
    context.documentElement = element.querySelector('.oni-document') as HTMLElement

    context.presentation.layout({
      width: 0, 
      height: 0,
      ...options?.layout
    })
    context.presentation.locate({
      ...options?.locate
    })
    /*
      * 개선 필요 *
      만약 이렇게 하지 않고, oniPDF 컴포넌트에서 locate와 layout의 초기 값을 설정하게되면 사용자는 
      모든 값이 설정된 상태를 EVENTS.RENDERED라는 이벤트가 아닌, EVENTS.READY라는 또 다른 이벤트에서 받을 수 있다.
      이건 사용에 좀 번거로움과 혼란을 줄 수도 있을 것 같다.
      근데 context.documentElement에 값을 넣어주는 부분이 너무 구리기 때문에 어떤 방법이 더 좋을지 논의하고 싶음!
    */

    context.oniPDF.emit(EVENTS.RENDERED)
  }
}
