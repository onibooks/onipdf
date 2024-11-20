import clsx from 'clsx'
import { useMemo, useEffect, useRef, useImperativeHandle } from 'react'
import { forwardRef } from 'preact/compat'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'
import { debounce } from '../utils/debounce'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

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

  let canvasPixels: ImageData
  let canvasContext: CanvasRenderingContext2D | null

  const drawPageAsPixmap = async () => {
    if (isRendered.current) return
    try {
      const canvas = await worker.getCanvasPixels(pageIndex, 96 * devicePixelRatio)
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        
        if (entry.isIntersecting) {
          drawPageAsPixmap()
        } else {
          clearPageAsPixmap()
        }
      })
    }, {
      root: context.documentElement,
      rootMargin: '200%'
    })

    observer.observe(pageSectionRef.current!)
  }

  const setPageSize = () => {
    const { scale } = context.sangte.getState()
    const scaledWidth = pageSize.width * scale
    const scaledHeight = pageSize.height * scale

    const { flow, rootWidth, rootHeight } = context.presentation.layout()
    const widthRatio = rootWidth / scaledWidth
    const heightRatio = rootHeight / scaledHeight
  
    const rootScale = scale === 1 
      ? Math.min(widthRatio, heightRatio)
      : 1
  
    const sectionVariables = {
      pageWidth: `${rootWidth}px`,
      pageHeight: flow === 'scrolled' ? `${scaledHeight * rootScale}px` : `${rootHeight}px`
    }
    const containerVariables = {
      pageWidth: `${scaledWidth * rootScale}px`,
      pageHeight: `${scaledHeight * rootScale}px`
    }

    context.totalHeights += scaledHeight * rootScale
  
    setCssVariables(sectionVariables, pageSectionRef.current!)
    setCssVariables(containerVariables, pageContainerRef.current!)
    setCssVariables(containerVariables, canvasRef.current!)

    return Promise.resolve()
  }

  const preRender = () => {
    // 앞뒤로 몇개 더 렌더링하기
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
  `,

  PageContainer: css`
    position: relative;
    top: 0;
    width: var(--page-width) !important;
    height: var(--page-height) !important;
    background-color: #bbb;
  `,

  PageCanvas: css`
    width: var(--page-width) !important;
    height: var(--page-height) !important;
  `
})

export default PageView
