import clsx from 'clsx'
import { useRef, useMemo, useEffect } from 'preact/hooks'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import { PageView } from '../documents/createPageView'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { pageViews, options } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])
  const documentRef = useRef<HTMLDivElement>(null)
  const visualListContainerRef = useRef<HTMLDivElement>(null)  
  const visualListRef = useRef<HTMLDivElement>(null)
  const MAX_DIV = options.page! + 10

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
    }
  }, [])

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    const fragment = document.createDocumentFragment()
    for (let page = options.page!; page < MAX_DIV; page++) {
      context.renderedPageViews.push(pageViews[page])

      const { pageSection } = pageViews[page] as PageView
      fragment.appendChild(pageSection)
    }
    
    visualListRef.current?.appendChild(fragment)
  }, [])

  // 이 부분이 사실 마음에 안든다.. 하지만 뼈대를 여기서 관리하고 있기 때문에 어쩔 수 없을거같기도...
  useEffect(() => {
    const targetPageView = pageViews[options.page!]
    const { width, height } = targetPageView.rootPageSize

    if (documentRef.current) {
      documentRef.current.style.width = `${width + 8}px`
    }
    if (visualListContainerRef.current) {
      visualListContainerRef.current.style.height = `${MAX_DIV * height}px`
    }
  }, [options.page, pageViews])

  return (
    <div 
      class={clsx('document', classes.Document)}
      ref={documentRef}
    >
      <div 
        className={clsx('visual-list-container', classes.VisualListContainer)} 
        ref={visualListContainerRef}
      >
        <div 
          className={clsx('visual-list-body', classes.VisualListBody)} 
          ref={visualListRef}
        />
      </div>
    </div>
  )
}

const createClasses = (
  css: Emotion['css'],
  options: Options
) => ({
  root: css`
    /* https://stackoverflow.com/questions/15751012/css-transform-causes-flicker-in-safari-but-only-when-the-browser-is-2000px-w#15759785 */
    backface-visibility: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    touch-action: pan-x pan-y;
    overscroll-behavior-y: contain;
  `,

  Document: css`
    margin: auto;
    outline: none;
    cursor: default;
    box-sizing: border-box;  
  `,

  VisualListContainer: css`
    position: relative;
    overflow: hidden;
    will-change: transform;
    width: 100%;
  `,

  VisualListBody: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: visible;
  `
})

export default OniPdf