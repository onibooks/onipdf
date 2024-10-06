import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import type { PageView } from '../documents/createPageView'

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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const renderedPageViewsRef = useRef<PageView[]>(context.renderedPageViews)

  const [renderedPageViews, setRenderedPageViews] = useState<PageView[]>(context.renderedPageViews)
  const [scale, setScale] = useState<number>(sangte.getState().scale)
  const [isScaling, setIsScaling] = useState<boolean>(false)

  const renderPage = (index: number, addToTop = false) => {
    if (isScaling) return
    if (!context.pageViews[index] || renderedPageViewsRef.current.includes(context.pageViews[index])) return
  
    const { pageSection } = context.pageViews[index] as PageView
    if (visualListRef.current?.contains(pageSection)) return
  
    if (addToTop) {
      visualListRef.current?.insertAdjacentElement('afterbegin', pageSection)
    } else {
      visualListRef.current?.insertAdjacentElement('beforeend', pageSection)
    }
  
    setRenderedPageViews((prev) => {
      const updated = [...prev, context.pageViews[index]]
      renderedPageViewsRef.current = updated

      return updated
    })
  }

  const removePage = (index: number) => {
    if (isScaling) return

    const pageView = context.pageViews[index]
    if (!pageView || !renderedPageViewsRef.current.includes(pageView)) return
  
    const { pageSection } = pageView
    if (visualListRef.current?.contains(pageSection)) {
      visualListRef.current.removeChild(pageSection)
    }

    setRenderedPageViews((prev) => {
      const updated = prev.filter((view) => view !== pageView)
      renderedPageViewsRef.current = updated

      return updated
    })
  }

  const setupIntersectionObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageIndex = parseInt(entry.target.getAttribute('data-index')!, 10)

          // 현재 페이지 기준으로 앞뒤로 최대 10개씩 페이지를 유지
          const startPage = Math.max(0, pageIndex - 10)
          const endPage = Math.min(pageIndex + 10, context.totalPages - 1)

          // 앞쪽 페이지 추가
          for (let i = startPage; i < pageIndex; i++) {
            if (!renderedPageViewsRef.current.includes(context.pageViews[i])) {
              renderPage(i, true)
            }
          }

          // 뒤쪽 페이지 추가
          for (let i = pageIndex + 1; i <= endPage; i++) {
            if (!renderedPageViewsRef.current.includes(context.pageViews[i])) {
              renderPage(i)
            }
          }

          // 앞쪽 페이지가 10개 초과하면 제거
          const renderedIndexes = renderedPageViewsRef.current.map((view) => context.pageViews.indexOf(view))
          const pagesToRemoveFront = renderedIndexes.filter((index) => index < startPage)
          pagesToRemoveFront.forEach((index) => {
            removePage(index)
          })

          // 뒤쪽 페이지가 10개 초과하면 제거
          const pagesToRemoveBack = renderedIndexes.filter((index) => index > endPage)
          pagesToRemoveBack.forEach((index) => {
            removePage(index)
          })
        }
      })
    }, {
      root: context.rootElement,
      threshold: 0.5
    })

    const currentPages = context.pageViews
    currentPages.forEach(page => observer.observe(page.pageSection))
    observerRef.current = observer
  }

  useEffect(() => {
    if (isScaling) return
    setupIntersectionObserver()

    return () => observerRef.current?.disconnect()
  }, [context.pageViews, context.rootElement, renderedPageViews, isScaling])

  useEffect(() => {
    const updateDimensions = () => {
      const targetPageNumber = Math.min(Math.max(0, options.page!), context.totalPages - 1)
      const targetPageView = pageViews[targetPageNumber]

      const { width, height } = targetPageView.rootPageSize
      const MAX_DIV = renderedPageViewsRef.current.length
  
      if (documentRef.current) {
        documentRef.current.style.width = `${width + 8}px`
      }
      if (visualListContainerRef.current) {
        visualListContainerRef.current.style.height = `${MAX_DIV * height}px`
      }
    }

    updateDimensions()
  }, [scale, renderedPageViews])

  useEffect(() => {
    context.renderedPageViews = renderedPageViews
    renderedPageViewsRef.current = renderedPageViews
  }, [renderedPageViews, context])

  // 페이지 초기 렌더링
  useEffect(() => {
    const renderPages = () => {
      const fragment = document.createDocumentFragment()
      const startPage = Math.max(0, options.page! - 10)
      const endPage = Math.min(options.page! + 10, context.totalPages - 1)

      for (let page = startPage; page <= endPage; page++) {
        if (!renderedPageViewsRef.current.includes(pageViews[page])) {
          setRenderedPageViews((prev) => {
            const updated = [...prev, pageViews[page]]
            renderedPageViewsRef.current = updated
            return updated
          })
          const { pageSection } = pageViews[page] as PageView
          fragment.appendChild(pageSection)
        }
      }
      visualListRef.current?.appendChild(fragment)
    }

    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    renderPages()
  }, [classes.root, options.page, pageViews])

  // scale이 업데이트 될 때 실행할 로직을 내부에서 이렇게 EVENTS로 처리하는게 맞는지..
  useEffect(() => {
    const handleScale = () => {
      setIsScaling(true)

      const { scale: updateScale } = sangte.getState()
      setScale(updateScale)
      console.log('updateScale', updateScale)

      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      setIsScaling(false)
      setupIntersectionObserver()
    }

    oniPDF.on(EVENTS.UPDATESCALE, handleScale)
    return () => oniPDF.off(EVENTS.UPDATESCALE, handleScale)
  }, [])

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
    }
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
