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
}

const debounceTimeoutDelay = 350

const PageView = ({
  context,
  pageMaxSize,
  pageSize,
  pageIndex,
  pageRender
}: PageViewProps) => {
  const { options, worker, presentation, documentElement, pageViews } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isObserver = useRef<boolean>(false)
  const isRendered = useRef<boolean>(false)
  const aspectRatioRef = useRef<number>(-1)

  let canvasPixels: ImageData
  let canvasContext: CanvasRenderingContext2D | null

  const currentSpread = pageViews.find((s) => s.pages.some((page) => page.pageIndex === pageIndex))
  const currentSpreadIndex = currentSpread  ? currentSpread.index : pageIndex

  const renderPage = () => {
    if (currentSpread?.cached) {
      restoreCanvasSize()
    } else {
      drawPageAsPixmap()
    }
  }

  const drawPageAsPixmap = async () => {
    if (isRendered.current) return
    if (currentSpread?.cached) return
    
    try {    
      canvasPixels = await worker.getCanvasPixels(pageIndex, 96 * devicePixelRatio)
      const canvasNode = canvasRef.current!
      canvasContext = canvasRef.current?.getContext('2d')!
      
      canvasNode.width = canvasPixels.width
      canvasNode.height = canvasPixels.height
      canvasContext?.putImageData(canvasPixels, 0, 0)
  
      currentSpread!.cached = true
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

  const setPageObserver = (): Promise<void> => {
    const parentElement = pageSectionRef.current?.parentElement
    const targetElement = parentElement?.classList.contains('spread')
      ? parentElement
      : pageSectionRef.current
  
    if (targetElement && observerRef.current) {
      observerRef.current.observe(targetElement)
      isObserver.current = true
    }
  
    return Promise.resolve()
  }

  const setPageUnobserver = (): Promise<void> => {
    observerRef.current?.disconnect()

    isObserver.current = false

    return Promise.resolve()
  }

  const setPagePosition = (event?: Event) => {
    const { leftRatio, topRatio } = (event as Event & { leftRatio: 0, topRatio: 0 })
    const { flow } = presentation.layout()

    if (flow === 'paginated') {
      // documentElement.scrollLeft = documentElement.scrollWidth * leftRatio
    } else {
      documentElement.scrollTop = documentElement.scrollHeight * topRatio
    }
  }

  const setScrolledRect = () => {
    const { rootWidth, divisor } = presentation.layout()

    const pageWidth = (rootWidth / divisor) * aspectRatioRef.current!
    const pageHeight = (pageWidth / pageSize.width) * pageSize.height
    const previousSpread = pageViews[currentSpreadIndex! - 1]?.rect
    const top = previousSpread ? previousSpread.top + previousSpread.height : 0
    
    currentSpread!.rect = {
      top: Math.round(top * 10) / 10,
      width: pageWidth,
      height: pageHeight
    }

    const sectionVariables = {
      pageWidth: `${rootWidth / divisor}px`,
      pageHeight: `${pageHeight}px`
    }

    const containerVariables = {
      pageWidth: `${pageWidth}px`,
      pageHeight: `${pageHeight}px`
    }

    setCssVariables(sectionVariables, pageSectionRef.current!)
    setCssVariables(containerVariables, pageContainerRef.current!)
  }

  const setPaginatedRect = () => {
    const {
      rootWidth,
      rootHeight,
      divisor
    } = presentation.layout()

    const widthRatio = rootWidth / ( pageSize.width * divisor)
    const heightRatio = rootHeight / (pageSize.height)
    const rootScale = Math.min(widthRatio, heightRatio)

    const pageWidth = pageSize.width * rootScale
    const pageHeight = pageSize.height * rootScale

    currentSpread!.rect = {
      top: 0,
      width: pageWidth * divisor,
      height: pageHeight
    }

    const sectionVariables = {
      pageWidth: `${rootWidth / divisor}px`,
      pageHeight: `${rootHeight}px`
    }

    const containerVariables = {
      pageWidth: `${pageWidth}px`,
      pageHeight: `${pageHeight}px`
    }

    setCssVariables(sectionVariables, pageSectionRef.current!)
    setCssVariables(containerVariables, pageContainerRef.current!)  
  }

  const updatePageSize = (): Promise<void> => {
    const { flow } = presentation.layout()

    if (flow === 'scrolled') {
      setScrolledRect()
    } else if (flow === 'paginated') {
      setPaginatedRect()
    }

    return Promise.resolve()
  }

  const initalizePageRect = (): Promise<void> => {
    const maxWidth = pageMaxSize.width
    const baseWidth = pageSize.width
    aspectRatioRef.current = baseWidth / maxWidth

    setScrolledRect()

    return Promise.resolve()
  }
  
  const setPageSize = (): Promise<void> => {
    const { flow } = presentation.layout()
    if (flow === 'paginated') {
      setPaginatedRect()
    }

    return Promise.resolve()
  }

  const preRender = () => {
    const { currentPage } = options.locate!

    if ((currentPage! / 2) - currentSpreadIndex <= 1) {
    // if ((currentPage! / 2) === currentSpreadIndex) {
      drawPageAsPixmap()
    }
  }

  useEffect(() => {
    const handleForceReflow = (event?: Event) => {
      const isForceReflow = event && (event as Event & { isForceReflow?: boolean }).isForceReflow
      if (!isForceReflow) return

      if (isObserver.current) {
        setPageUnobserver()
      }

      updatePageSize()
        .then(() => {
          // const { currentPage } = context.presentation.locate()
          // const { rootWidth, flow } = presentation.layout()
          // const scrollValue = flow === 'paginated'
          //   ? currentPage! * rootWidth
          //   : pageViews[currentPage!]?.rect.top
          
          // if (flow === 'paginated') {
          //   documentElement.scrollLeft = scrollValue
          // } else {
          //   documentElement.scrollTop = scrollValue
          // }
        })
    }

    const handleResize = (event?: Event) => {
      if (isObserver.current) {
        setPageUnobserver()
      }

      updatePageSize()
        .then(() => context.oniPDF.emit(EVENTS.UPDATEPAGESIZE))
    }
    
    const handleResized = debounce((event?: Event) => {
      if (!isObserver.current) {
        setPageObserver()
      }
    }, debounceTimeoutDelay)
    
    context.oniPDF.on(EVENTS.RESIZE, handleResize)
    context.oniPDF.on(EVENTS.RESIZED, handleResized)
    return () => {
      context.oniPDF.off(EVENTS.RESIZE, handleResize)
      context.oniPDF.off(EVENTS.RESIZED, handleResized)
    }
  }, [])
  
  useEffect(() => {
    initalizePageRect()
    .then(() => setPageSize())
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

    .double & {
      &:first-child {
        justify-content: flex-end;
      }
      &:last-child {
        justify-content: flex-start;
      }
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
