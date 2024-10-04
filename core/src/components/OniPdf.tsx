import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import { PageView } from '../documents/createPageView'
import { EVENTS } from '../constants'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, pageViews, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])
  const documentRef = useRef<HTMLDivElement>(null)
  const visualListContainerRef = useRef<HTMLDivElement>(null)  
  const visualListRef = useRef<HTMLDivElement>(null)
  
  const [scale, setScale] = useState<number>(sangte.getState().scale)
  

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
    }
  }, [])

  useEffect(() => {
    const renderPages = () => {
      const fragment = document.createDocumentFragment()

      const startPage = Math.max(0, options.page! - 10)
      const endPage = Math.min(options.page! + 10, context.totalPages - 1)
      for (let page = startPage!; page < endPage; page++) {
        context.renderedPageViews.push(pageViews[page])
        
        const { pageSection } = pageViews[page] as PageView
        fragment.appendChild(pageSection)
      }
      visualListRef.current?.appendChild(fragment)
    }

    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    renderPages()
  }, [classes.root, options.page, pageViews])

  useEffect(() => {
    const updateDimensions = () => {
      const targetPageNumber = Math.min(Math.max(0, options.page!), context.totalPages - 1)
      const targetPageView = pageViews[targetPageNumber]

      const { width, height } = targetPageView.rootPageSize
      const MAX_DIV = context.renderedPageViews.length
  
      if (documentRef.current) {
        documentRef.current.style.width = `${width + 8}px`
      }
      if (visualListContainerRef.current) {
        visualListContainerRef.current.style.height = `${MAX_DIV * height}px`
      }
    }

    updateDimensions()
  }, [scale])

  // scale이 업데이트 될 때 실행할 로직을 내부에서 이렇게 EVENTS로 처리하는게 맞는지..
  useEffect(() => {
    const handleScale = () => {
      const { scale: updateScale } = sangte.getState()
      setScale(updateScale)
    }

    oniPDF.on(EVENTS.UPDATESCALE, handleScale)
    return () => oniPDF.off(EVENTS.UPDATESCALE, handleScale)
  }, [])

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