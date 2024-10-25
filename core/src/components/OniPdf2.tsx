import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import { debounce } from '../utils/debounce'
import { addStyles } from '../utils'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, pageViews, presentation, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])
  const { scale } = sangte.getState()
  
  const flow = options?.layout?.flow ?? 'scrolled'
  const spread = options?.layout?.spread ?? 'single'
  
  const documentRef = useRef<HTMLDivElement>(null)
  const visualListContainerRef = useRef<HTMLDivElement>(null)  
  const visualListRef = useRef<HTMLDivElement>(null)
  
  const [documentWidth, setDocumentWidth] = useState<number>(0)
  const [visualListHeight, setVisualListHeight] = useState<number>(0)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)

  const cachedPages = new Set<number>()
  const renderedPages = new Set<number>()
  const renderingPages = new Set<number>()

  const renderPage = async (index: number) => {
    if (!context.pageViews[index]) return

    if (cachedPages.has(index)) {
      context.pageViews[index].restoreCanvasSize()
      renderedPages.add(index)

      console.log('캐싱 데이터 사용:', index)
    } else if (!renderingPages.has(index)) {
      renderingPages.add(index)

      await context.pageViews[index].drawPageAsPixmap()
      
      cachedPages.add(index)
      renderedPages.add(index)
      console.log('페이지 렌더링:', index)
      
      renderingPages.delete(index)
    }
  }

  const removePage = (index: number) => {
    if (renderedPages.has(index)) {
      console.log('캔버스 크기 제거:', index)
      
      context.pageViews[index].clearCanvasSize()
      renderedPages.delete(index) // 화면에서 제거
    }
  }

  const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver(debounce((entries) => {
      entries.forEach(async (entry: IntersectionObserverEntry) => {
        const pageIndex = parseInt(entry.target.getAttribute('data-index')!)

        context.options.page = pageIndex
        setCurrentPageIndex(pageIndex)
        
        if (entry.isIntersecting) {  
          await renderPage(pageIndex)
          
          // 현재 페이지를 기준으로 앞뒤로 최대 10개씩 캔버스 렌더링
          const startIndex = Math.max(0, pageIndex - 10)
          const endIndex = Math.min(pageIndex + 10, context.totalPages - 1)
            
          const pageRenderPromises = []
          for (let i = startIndex; i <= endIndex; i++) {
            if (i !== pageIndex && !renderedPages.has(i) && !renderingPages.has(i)) {
              pageRenderPromises.push(renderPage(i))
            }
          }

          await Promise.all(pageRenderPromises)

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

    pageViews.forEach((page) => observer.observe(page.pageSection))

    return () => {
      observer.disconnect()
    }
  }

  useEffect(() => {
    oniPDF.goToPage(options.page)

    setupIntersectionObserver()
  }, [])

  const updateDimensions = (scale: number) => {
    const totalPages = context.totalPages
    const targetPageNumber = Math.min(Math.max(0, options.page!), totalPages - 1)
    const targetPageView = pageViews[targetPageNumber]

    if (!targetPageView) return
  
    const { width, height } = targetPageView.rootPageSize
    const { divisor } = presentation.layout()
    const divisorWidth = divisor === 2 ? context.rootElement.offsetWidth : width
    
    if (documentRef.current) {
      const PAGE_MARGIN = 8
      const newWidth = divisorWidth * scale + PAGE_MARGIN
      setDocumentWidth(newWidth)
    }
  
    if (visualListContainerRef.current) {
      setVisualListHeight(totalPages * height)
    }
  }

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)
  }, [])

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
      
      oniPDF.layout({ flow, spread })

      // 코드 정리 필요
      addStyles(context.rootElement, {
        overflow: oniPDF.layout().flow === 'paginated' ? 'hidden' : ''
      })
    }
  }, [])

  useEffect(() => {
    const renderLayout = () => {
      const fragment = document.createDocumentFragment()
      
      context.pageViews.map((page) => fragment.appendChild(page.pageSection))
      
      visualListRef.current?.appendChild(fragment)
    }
    
    renderLayout()
  }, [])

  useEffect(() => {
    updateDimensions(scale)
  }, [])

  useEffect(() => {
    // 현재 페이지를 기준으로 계산되도록 수정하기
    let pageIndex = 0
    
    const handleArrowKey = (event: KeyboardEvent) => {
      console.log(pageIndex)
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        if (pageIndex < context.totalPages - 1) {
          pageIndex++
          oniPDF.goToPage(pageIndex)
        }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        if (pageIndex > 0) {
          pageIndex--
          oniPDF.goToPage(pageIndex)
        }
      }

      setCurrentPageIndex(pageIndex)
    }

    window.addEventListener('keydown', handleArrowKey)
    return () => window.removeEventListener('keydown', handleArrowKey)
  }, [])

  useEffect(() => {
    const handleReflow = () => {
      oniPDF.goToPage(context.options.page)

      addStyles(context.rootElement, {
        overflow: oniPDF.layout().flow === 'paginated' ? 'hidden' : ''
      })

      updateDimensions(scale)
    }

    oniPDF.on(EVENTS.REFLOW, handleReflow)
    return () => oniPDF.off(EVENTS.REFLOW, handleReflow)
  }, [])

  useEffect(() => {
    const handleScale = ({ scale }: { scale: number }) => {
      updateDimensions(scale)
    }

    oniPDF.on(EVENTS.UPDATESCALE, handleScale)
    return () => oniPDF.off(EVENTS.UPDATESCALE, handleScale)
  }, [])

  return (
    <div
      class={clsx('document', classes.Document)}
      ref={documentRef}
      style={{ width: `${documentWidth}px` }}
    >
      <div
        className={clsx('visual-list-container', classes.VisualListContainer)}
        style={{ height: `${visualListHeight}px` }}
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
