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
  const { oniPDF, pageViews, options } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])
  const documentRef = useRef<HTMLDivElement>(null)
  const visualListContainerRef = useRef<HTMLDivElement>(null)  
  const visualListRef = useRef<HTMLDivElement>(null)  
  const currentPageView = useRef<PageView>(pageViews[options.page!])
  const documentWidthRef = useRef<number>(currentPageView.current?.pageSize.width || 0)
  const visualContainerHeightRef = useRef<number>(currentPageView.current?.pageSize.height || 0)
  
  const renderCurrentPage = async () => {
    const totalPages = await oniPDF.getTotalPages()

    if (totalPages === pageViews.length) {
      oniPDF.renderToCanvas(options.page)
    }
  }

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
    }

    renderCurrentPage()
  }, [])

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    for (const page of context.pageViews) {
      visualListRef.current?.appendChild(page.pageSection)
    }
  }, [])

  useEffect(() => {
    if (options.page && pageViews[options.page]) {
      currentPageView.current = pageViews[options.page]
      documentWidthRef.current = (((currentPageView.current.pageSize.width * currentPageView.current.zoom) / 72) | 0) + 3
      visualContainerHeightRef.current = (((currentPageView.current.pageSize.height * currentPageView.current.zoom) / 72) | 0)

      if (documentRef.current) {
        documentRef.current.style.width = `${documentWidthRef.current}px`
      }
      if (visualListContainerRef.current) {
        visualListContainerRef.current.style.height = `${visualContainerHeightRef.current}px`
      }
    }
  }, [options.page, pageViews])

  return (
    <div 
      class={clsx('document', classes.Document)}
      style={{ width: documentWidthRef+'px' }}
      ref={documentRef}
    >
      <div 
        className={clsx('visual-list-container', classes.VisualListContainer)} 
        ref={visualListContainerRef}
      >
        {pageViews && <div 
          className={clsx('visual-list-body', classes.VisualListBody)} 
          ref={visualListRef}
        />}
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

    height: ${options.layout && options.layout.flow === 'scrolled' ? '' : ''}
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