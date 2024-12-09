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
  const { worker } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isRendered = useRef<boolean>(false)
  const aspectRatioRef = useRef<number>(-1)

  const renderedPages = new Set<number>()
  const renderingPages = new Set<number>()

  let canvasPixels: ImageData
  let canvasContext: CanvasRenderingContext2D | null

  const drawPageAsPixmap = async (page = pageIndex) => {
    if (isRendered.current) return
    
    try {
      const canvas = await worker.getCanvasPixels(page, 96 * devicePixelRatio)
      const canvasNode = canvasRef.current!
      const canvasContext = canvasRef.current?.getContext('2d')
      
      canvasNode.width = canvas.width
      canvasNode.height = canvas.height
      canvasContext?.putImageData(canvas, 0, 0)

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

  const setupIntersectionObserver = () => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(async (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          drawPageAsPixmap()
        } else {
          // clearPageAsPixmap()
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

  const updatePageSize = () => {
    const {
      flow,
      rootWidth,
      rootHeight
    } = context.presentation.layout()
    
    if (flow === 'scrolled') {
      const pageWidth = rootWidth * aspectRatioRef.current!
      const pageHeight = (pageWidth / pageSize.width) * pageSize.height
      
      const previousPage = context.pageSizes[pageIndex - 1]
      const top = previousPage ? previousPage.top + previousPage.height : 0

      context.pageSizes[pageIndex] = {
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

      context.pageSizes[pageIndex] = {
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
    const { flow } = context.presentation.layout()
    if (flow === 'scrolled') {
      const maxWidth = pageMaxSize.width
      const baseWidth = pageSize.width
      // 현재 pdf에서 몇 퍼센트를 차지하고 있는지
      aspectRatioRef.current = baseWidth / maxWidth

      updatePageSize()
    } else if (flow === 'paginated') {
      updatePageSize()
    }

    return Promise.resolve()
  }

  const preRender = () => {
    const { currentPage } = context.options.locate!
    if (currentPage === pageIndex) {
      drawPageAsPixmap()
    }
  }

  useEffect(() => {
    const handleResize = (event?: Event) => {
      isRendered.current = false
      setPageUnobserver()

       // 이게 완전히 끝나고 isRendered true로 바꿔주기
      updatePageSize()
      // onUpdateComplete()
    }

    const handleResized = debounce((event?: Event) => {
      setPageObserver()
    }, 350)

    // context.oniPDF.on(EVENTS.RESIZE, () => {
    //   console.log(1123)
    // })
    // context.oniPDF.on(EVENTS.RESIZED, handleResized) // 왜 여러번 실행되는거지?
    window.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResized)
    return () => {
      // context.oniPDF.off(EVENTS.RESIZE, handleResize)
      // context.oniPDF.off(EVENTS.RESIZED, handleResized)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResized)
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
    /* width, height 지정 안해주는게 좀 더 빠른 것 같기도... */
    /* width: var(--page-width) !important;
    height: var(--page-height) !important; */
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
