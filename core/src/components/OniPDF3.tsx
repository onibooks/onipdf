import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'
import { debounce } from '../utils/debounce'

import Single from './Spread/Single'
import Double from './Spread/Double'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'

type OniPDFProps = {
  context: GlobalContext
}

const OniPDF = ({
  context
}: OniPDFProps) => {
  const { oniPDF, presentation, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])

  const oniDocumentRef = useRef<HTMLDivElement>(null)
  const oniContainerRef = useRef<HTMLDivElement>(null)
  const oniBodyRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const [spread, setSpread] = useState('')


  const cachedPages = new Set<number>()
  const renderedPages = new Set<number>()
  const renderingPages = new Set<number>()

  const renderPage = (index: number) => {
    // if (!context.pageViews[index]) return

    if (cachedPages.has(index)) {
      console.log('restoreCanvasSize')
      // context.pageViews[index].restoreCanvasSize()
      renderedPages.add(index)

      console.log('캐싱 데이터 사용:', index)
    } else if (!renderingPages.has(index)) {
      renderingPages.add(index)

      console.log('drawPageAsPixmap')
      // await context.pageViews[index].drawPageAsPixmap()
      
      cachedPages.add(index)
      renderedPages.add(index)
      console.log('페이지 렌더링:', index)
      
      renderingPages.delete(index)
    }
  }

  const removePage = (index: number) => {
    if (renderedPages.has(index)) {
      console.log('캔버스 크기 제거:', index)
      
      // context.pageViews[index].clearCanvasSize()
      console.log('clearCanvasSize')
      renderedPages.delete(index) // 화면에서 제거
    }
  }

  const setupIntersectionObserver = () => {
    observer.current = new IntersectionObserver(debounce((entries) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        const target = entry.target as HTMLDivElement
        const pageIndex = parseInt(target.dataset.pageIndex!, 10)
        
        if (entry.isIntersecting) {
          sangte.setState({ currentIndex: pageIndex })

          renderPage(pageIndex)

          // 현재 페이지를 기준으로 앞뒤로 최대 10개씩 캔버스 렌더링
          const startIndex = Math.max(0, pageIndex - 10)
          const endIndex = Math.min(pageIndex + 10, context.totalPages - 1)
            
          const pageRenderPromises = []
          for (let i = startIndex; i <= endIndex; i++) {
            if (i !== pageIndex && !renderedPages.has(i) && !renderingPages.has(i)) {
              pageRenderPromises.push(renderPage(i))
            }
          }

          Promise.all(pageRenderPromises)

          renderedPages.forEach((index) => {
            if (index < startIndex || index > endIndex) {
              removePage(index)
            }
          })
        }
      })
    }, 100), {
      root: context.rootElement,
      threshold: 0.5
    })

    return () => observer.current?.disconnect()
  }

  useEffect(() => {
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current
    }
  }, [])

  useEffect(() => {
    const { spread } = presentation.layout({
      width: 0,
      height: 0,
      ...options.layout
    })
    setSpread(spread!)
    
    setupIntersectionObserver()
  }, [])
  
  useEffect(() => {
    const handleResize = (event?: Event) => {
      const {
        flow,
        rootWidth,
        rootHeight,
        totalWidth,
        totalHeight
      } = presentation.layout({
        width: context.rootElement.clientWidth,
        height: context.rootElement.clientHeight,
        totalWidth: context.rootElement.clientWidth * context.totalPages,
        totalHeight: context.rootElement.clientHeight * context.totalPages
      })
      
      const rootVariables = {
        rootWidth: `${rootWidth}px`,
        rootHeight: `${rootHeight}px`
      }
      
      const totalVariables = {
        totalWidth: flow === 'paginated' ? `${totalWidth}px` : `${rootWidth}px`,
        totalHeight: flow === 'scrolled' ? `${totalHeight}px` : `${rootHeight}px`
      }
      
      setCssVariables(rootVariables, context.rootElement as HTMLElement)
      setCssVariables(totalVariables, oniContainerRef.current as HTMLElement)
      
      if (event) {
        oniPDF.emit(EVENTS.RESIZE, event)
      }
    }

    handleResize()

    window.addEventListener(EVENTS.RESIZE, handleResize)
    return () => {
      window.removeEventListener(EVENTS.RESIZE, handleResize)
    }
  }, [])

  return (
    <div
      class={clsx('oni-document', classes.OniDocument)}
      ref={oniDocumentRef}
      >
      <div
        className={clsx('oni-container', classes.OniContainer)}
        ref={oniContainerRef}
      >
        <div
          className={clsx('oni-body', classes.OniBody)}
          ref={oniBodyRef}
        >
          {spread === 'single'
            ? (<Single
                context={context}
                observer={observer.current}
              />)
            : <Double context={context} />
          }
        </div>
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

  OniDocument: css`
    outline: none;
    cursor: default;
    box-sizing: border-box;  

    &.scrolled {
      width: 100%;
      overflow: auto;
    }
    &.paginated {
      overflow: hidden;
    }
  `,

  OniContainer: css`
    position: relative;
    overflow: hidden;
    will-change: transform;
    width: var(--total-width) !important;
    height: var(--total-height) !important;
  
    .scrolled & {
      margin: 0 auto;
    }
  `,

  OniBody: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: visible;

    .paginated & {
      display : flex;
    }
  `
})

export default OniPDF