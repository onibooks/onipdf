import clsx from 'clsx'
import { useMemo, useEffect, useRef } from 'react'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'
import { debounce } from '../utils/debounce'

type Size = {
  width: number
  height: number
}

type PageViewProps = {
  context: GlobalContext
  pageMaxSize: Size
  pageSize: Size
  pageIndex: number
  pageRender: (value: unknown) => void
  onUpdateComplete?: any
}

const PageView = ({
  context,
  pageMaxSize,
  pageSize,
  pageIndex,
  pageRender,
  onUpdateComplete
}: PageViewProps) => {
  const { oniPDF, options, worker, presentation, documentElement, pageViews } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isRendered = useRef<boolean>(false)
  const aspectRatioRef = useRef<number>(-1)

  let canvasPixels: ImageData
  let canvasContext: CanvasRenderingContext2D | null

  const renderPage = () => {
    if (pageViews[pageIndex]?.cached) {
      restoreCanvasSize()
    } else {
      drawPageAsPixmap()
    }
  }

  const drawPageAsPixmap = async () => {
    if (isRendered.current) return
    if (pageViews[pageIndex].cached) return
    
    try {    
      canvasPixels = await worker.getCanvasPixels(pageIndex, 96 * devicePixelRatio)
      const canvasNode = canvasRef.current!
      canvasContext = canvasRef.current?.getContext('2d')!
      
      canvasNode.width = canvasPixels.width
      canvasNode.height = canvasPixels.height
      canvasContext?.putImageData(canvasPixels, 0, 0)
  
      context.pageViews[pageIndex].cached = true

      isRendered.current = true
    } catch (error) {
      console.error('Error rendering to canvas:', error)
    }
  }

  const clearPageAsPixmap = () => {
    if (!isRendered.current) return

    const canvasNode = canvasRef.current!
    canvasNode.width = 0
    canvasNode.height = 0

    isRendered.current = false
  }

  const restoreCanvasSize = () => {
    const canvasNode = canvasRef.current!

    canvasNode.width = canvasPixels.width
    canvasNode.height = canvasPixels.height

    if (canvasContext) {
      canvasContext.putImageData(canvasPixels, 0, 0)
    }
  }

  const setupIntersectionObserver = () => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(async (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          renderPage()
        } else {
          clearPageAsPixmap()
        }
      })
    }, {
      root: context.documentElement,
      rootMargin: '200%'
    })

    setPageObserver()
  }

  const setPageObserver = () => {
    observerRef.current?.observe(pageSectionRef.current!)
    
    return Promise.resolve()
  }
  
  const setPageUnobserver = () => {
    observerRef.current?.disconnect()

    return Promise.resolve()
  }

  const setPagePosition = (event?: Event) => {
    const { leftRatio, topRatio } = (event as Event & { leftRatio: 0, topRatio: 0 })
    const { documentElement, presentation } = context
    const { flow } = presentation.layout()

    if (flow === 'paginated') {
      documentElement.scrollLeft = documentElement.scrollWidth * leftRatio
    } else {
      documentElement.scrollTop = documentElement.scrollHeight * topRatio
    }
  }

  const updatePageSize = () => {
    const {
      flow,
      rootWidth,
      rootHeight
    } = presentation.layout()
    
    if (flow === 'scrolled') {
      const pageWidth = rootWidth * aspectRatioRef.current!
      const pageHeight = (pageWidth / pageSize.width) * pageSize.height
      
      const previousPage = pageViews[pageIndex - 1]?.size
      const top = previousPage ? previousPage.top + previousPage.height : 0

      pageViews[pageIndex].size = {
        top: Math.round(top) * 10 / 10,
        width: pageWidth,
        height: pageHeight
      }

      const sectionVariables = {
        pageWidth: `${rootWidth}px`,
        pageHeight: `${pageHeight}px`
      }
      const containerVariables = {
        pageWidth: `${pageWidth}px`,
        pageHeight: `${pageHeight}px`
      }
  
      setCssVariables(sectionVariables, pageSectionRef.current!)
      setCssVariables(containerVariables, pageContainerRef.current!)
    } else if (flow === 'paginated') {
      const widthRatio = rootWidth / pageSize.width
      const heightRatio = rootHeight / pageSize.height
      const rootScale = Math.min(widthRatio, heightRatio)

      const pageWidth = pageSize.width * rootScale
      const pageHeight = pageSize.height * rootScale

      pageViews[pageIndex].size = {
        top: 0,
        width: pageWidth,
        height: pageHeight
      }

      const sectionVariables = {
        pageWidth: `${rootWidth}px`,
        pageHeight: `${rootHeight}px`
      }

      const containerVariables = {
        pageWidth: `${pageWidth}px`,
        pageHeight: `${pageHeight}px`
      }

      setCssVariables(sectionVariables, pageSectionRef.current!)
      setCssVariables(containerVariables, pageContainerRef.current!)  
    }

    return Promise.resolve()
  }

  const setPageSize = () => {
    const { flow } = presentation.layout()
    if (flow === 'scrolled') {
      const maxWidth = pageMaxSize.width
      const baseWidth = pageSize.width
      aspectRatioRef.current = baseWidth / maxWidth

      updatePageSize()
    } else if (flow === 'paginated') {
      updatePageSize()
    }

    return Promise.resolve()
  }

  const preRender = () => {
    const { currentPage } = options.locate!
    if (currentPage === pageIndex) {
      drawPageAsPixmap()
    }
  }

  useEffect(() => {
    const handleResize = (event?: Event) => {
      setPageUnobserver()

      updatePageSize()
        .then(() => setPagePosition(event))
    }
    
    const handleResized = debounce((event?: Event) => {
      setPageObserver()
    }, 350)

    context.oniPDF.on(EVENTS.FORCERESIZE, handleResize)
    context.oniPDF.on(EVENTS.FORCERESIZED, handleResized)
    return () => {
      context.oniPDF.off(EVENTS.FORCERESIZE, handleResize)
      context.oniPDF.off(EVENTS.FORCERESIZED, handleResized)
    }
  }, [])

  useEffect(() => {
    setPageSize()
      .then(() => pageRender(null))
      .then(() => preRender())
  }, [])

  useEffect(() => {
    const handleReady = () => {
      setupIntersectionObserver()
    }
    
    context.oniPDF.on(EVENTS.RENDER, handleReady)
  }, [])

  return (
    <div
      data-index={pageIndex}
      className={clsx('page-section', classes.PageSection)}
      ref={pageSectionRef}
    >
      <div 
        className={clsx('page-container', classes.PageContainer)}
        ref={pageContainerRef}
      >
        <canvas 
          className={clsx('page-canvas', classes.PageCanvas)}
          ref={canvasRef}
        />
      </div>
    </div>
  )
}

const createClasses = (
  css: Emotion['css']
) => ({
  PageSection: css`
    position: relative;
    width: var(--page-width) !important;
    height: var(--page-height) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #DDD;

    .scrolled & {
      font-size: 0;
    }

    .paginated & {
      flex-shrink: 0;
    }
  `,

  PageContainer: css`
    position: relative;
    top: 0;
    width: var(--page-width) !important;
    height: var(--page-height) !important;
  `,

  PageCanvas: css`
    width: 100%;
    height: 100%;
  `
})

export default PageView
