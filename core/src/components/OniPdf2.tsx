import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import { debounce } from '../utils/debounce'
import { addClass, addStyles, removeStyles } from '../utils'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, pageViews, presentation, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])
  const { scale } = sangte.getState()
  
  const documentRef = useRef<HTMLDivElement>(null)
  const visualListContainerRef = useRef<HTMLDivElement>(null)  
  const visualListRef = useRef<HTMLDivElement>(null)
  
  const [visualListWidth, setVisualListWidth] = useState<number>(0)
  const [visualListHeight, setVisualListHeight] = useState<number>(0)

  const cachedPages = new Set<number>()
  const renderedPages = new Set<number>()
  const renderingPages = new Set<number>()

  const PAGE_MARGIN = 8

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

        if (entry.isIntersecting) {
          sangte.setState({ currentIndex: pageIndex })
          context.options.page = pageIndex
          
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

  const updateDimensions = (scale: number) => {
    const totalPages = context.totalPages
    const targetPageNumber = Math.min(Math.max(0, options.page!), totalPages - 1)
    const targetPageView = pageViews[targetPageNumber]
    if (!targetPageView) return
  
    const { divisor, flow } = context.presentation.layout()
    const { width, height } = targetPageView.rootPageSize

    const scaledWidth = (width * divisor) * scale + PAGE_MARGIN

    if (documentRef.current) {
      if (flow === 'paginated') {
        updatePaginatedLayout(width, height, totalPages, divisor, scale)
      } else {
        updateScrolledLayout(scaledWidth, height, totalPages, divisor)
      }
    }
  }

  const updatePaginatedLayout = (
    width: number,
    height: number,
    totalPages: number,
    divisor: number,
    scale: number
  ) => {
    removeStyles(documentRef.current as HTMLElement)
    removeStyles(visualListContainerRef.current as HTMLElement)
    
    const documentWidth = (width * divisor) * scale
    const visualListWidth= (width * totalPages * divisor) * scale + PAGE_MARGIN
    const visualListHeight = height
    setVisualListWidth(visualListWidth)
    setVisualListHeight(visualListHeight)

    addStyles(documentRef.current as HTMLDivElement, {
      width: `${documentWidth}px`,
      overflow: 'hidden'
    })
    addStyles(visualListRef.current as HTMLDivElement, {
      display: 'flex'
    })
  }

  const updateScrolledLayout = (
    scaledWidth: number,
    height: number,
    totalPages: number,
    divisor: number
  ) => {
    removeStyles(context.rootElement as HTMLElement)
    removeStyles(documentRef.current as HTMLElement)
    removeStyles(visualListRef.current as HTMLElement)
    
    addStyles(documentRef.current as HTMLDivElement, {
      width: '100%',
      overflow: 'auto'
    })
    addStyles(visualListContainerRef.current as HTMLDivElement, {
      margin: '0 auto'
    })
    
    const totalHeight = (totalPages / divisor) * height
    setVisualListWidth(scaledWidth)
    setVisualListHeight(totalHeight)
  }

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    if (documentRef.current) {
      context.documentElement = documentRef.current

      const { flow } = context.options.layout!
      addStyles(context.rootElement, {
        overflow: flow === 'paginated' ? 'hidden' : ''
      })
    }
  }, [])

  useEffect(() => {
    const { layout, locate } = context.options
    
    context.presentation.layout({
      ...layout
    })

    context.presentation.locate({
      ...locate
    })
  }, [])

  useEffect(() => {
    Promise.all(context.pageViews.map((pageView) => pageView.init()))
      .then(() => updateDimensions(scale))
      .then(() => oniPDF.goToPage(options.page))
      .then(() => setupIntersectionObserver())
  }, [])

  useEffect(() => {
    const renderLayout = () => {
      const { divisor } = presentation.layout()
      const fragment = document.createDocumentFragment()
  
      if (divisor === 1) {
        context.pageViews.forEach((page) => fragment.appendChild(page.pageSection))
      } else if (divisor === 2) {
        context.pageViews.reduce((acc, pageView, index) => {
          if (index % 2 === 0) {
            const spread = document.createElement('div')
            addClass(spread, 'spread')
            
            acc.push(spread)
            fragment.appendChild(spread)
          }

          acc[acc.length - 1].appendChild(pageView.pageSection)
          
          return acc
        }, [] as HTMLElement[])
      }

      visualListRef.current?.appendChild(fragment)
    }
  
    renderLayout()
  }, [])

  useEffect(() => {
    const handleReflow = () => {
      const { currentIndex } = sangte.getState()
      oniPDF.goToPage(currentIndex)

      updateDimensions(scale)
    }

    const handleScale = ({ scale }: { scale: number }) => {
      updateDimensions(scale)
    }

    const handleArrowKey = (event: KeyboardEvent) => {
      let { currentIndex: pageIndex } = sangte.getState()

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

      sangte.setState({ currentIndex: pageIndex })
    }

    const handleResize = () => {
      console.log('handleResize')
    }

    const handleResized = debounce((event?: Event) => {
      if (event) {
        console.log('handleResized')
      }
    }, 250)

    oniPDF.on(EVENTS.REFLOW, handleReflow)
    oniPDF.on(EVENTS.UPDATESCALE, handleScale)
    window.addEventListener('keydown', handleArrowKey)

    console.log(context.rootElement)
    window.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResized)

    return () => {
      oniPDF.off(EVENTS.REFLOW, handleReflow)
      oniPDF.off(EVENTS.UPDATESCALE, handleScale)
      window.removeEventListener('keydown', handleArrowKey)

      window.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResized)
    }
  }, [])

  return (
    <div
      class={clsx('document', classes.Document)}
      ref={documentRef}
    >
      <div
        className={clsx('visual-list-container', classes.VisualListContainer)}
        style={{
          width: `${visualListWidth}px`,
          height: `${visualListHeight}px`
        }}
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
