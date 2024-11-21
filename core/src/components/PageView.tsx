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
  pageSize: Size
  pageIndex: number
  pageRender: (value: unknown) => void
}

const PageView = ({
  context,
  pageSize,
  pageIndex,
  pageRender
}: PageViewProps) => {
  const { worker } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isRendered = useRef<boolean>(false)

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
    const observer = new IntersectionObserver(debounce((entries) => {
      entries.forEach(async (entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          drawPageAsPixmap()
        } else {
          clearPageAsPixmap()
        }
      })
    }, 200), {
      root: context.documentElement,
      rootMargin: '200%'
    })

    observer.observe(pageSectionRef.current!)
  }

  const setPageSize = () => {
    const { flow } = context.presentation.layout()
    const { rootWidth, rootHeight } = context.presentation.layout()
    
    if (flow === 'scrolled') {
      const baseWidth = pageSize.width
      const baseHeight = pageSize.height
      const ratioDifference = (rootWidth - baseWidth) / baseWidth
      
      let pageWidth = rootWidth

      if (ratioDifference >= 0.8) {
        pageWidth = rootWidth * 0.6 // rootWidth의 최대 60%까지만 허용
      }
      const pageHeight = pageWidth * (baseHeight / baseWidth)
  
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
    } else {
      const baseWidth = pageSize.width
      const baseHeight = pageSize.height
      const widthRatio = rootWidth / baseWidth
      const heightRatio = rootHeight / baseHeight

      const rootScale = Math.min(widthRatio, heightRatio)

      const sectionVariables = {
        pageWidth: `${rootWidth}px`,
        pageHeight: `${rootHeight}px`
      }

      const containerVariables = {
        pageWidth: `${baseWidth * rootScale}px`,
        pageHeight: `${baseHeight * rootScale}px`
      }

      setCssVariables(sectionVariables, pageSectionRef.current!)
      setCssVariables(containerVariables, pageContainerRef.current!)
    }

    return Promise.resolve()
  }

  const preRender = () => {
    if (context.options.page === pageIndex) {
      drawPageAsPixmap()
    }
  }

  useEffect(() => {
    const handleResize = (event?: Event) => {
      setPageSize()
    }

    context.oniPDF.on(EVENTS.RESIZE, handleResize)
    return () => {
      context.oniPDF.off(EVENTS.RESIZE, handleResize)
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

    context.oniPDF.on(EVENTS.READY, handleReady)
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
    background-color: #ddd;
    
    .scrolled & {
      font-size: 0;
    }
    `,

  PageContainer: css`
    position: relative;
    top: 0;
    width: var(--page-width) !important;
    height: var(--page-height) !important;
    background-color: pink;
  `,

  PageCanvas: css`
    width: 100%;
    height: 100%;
  `
})

export default PageView
