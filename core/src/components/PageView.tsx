import clsx from 'clsx'
import { useMemo, useEffect, useRef, useImperativeHandle } from 'react'
import { forwardRef } from 'preact/compat'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type Size = {
  width: number
  height: number
} | null

type PageViewProps = {
  context: GlobalContext
  pageIndex: number
  observer: IntersectionObserver | null
}

const PageView = forwardRef(({
  context,
  pageIndex,
  observer
}: PageViewProps, ref) => {
  const { worker, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const defaultPageSize = useRef<Size>(null)
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isRendered = useRef<boolean>(false)
  
  let canvasPixels: ImageData
  let canvasContext: CanvasRenderingContext2D | null

  useImperativeHandle(ref, () => ({
    drawPageAsPixmap: async () => {
      if (isRendered.current) return
      const zoom = sangte.getInitialState().scale * 96
      const canvas = await worker.getCanvasPixels(pageIndex, zoom * devicePixelRatio)
      if (!canvas) {
        throw new Error('Fail getCanvasPixels')
      }

      if (!canvasRef.current) return
      canvasRef.current.width = canvas.width
      canvasRef.current.height = canvas.height
      canvasContext = canvasRef.current?.getContext('2d')
      canvasContext?.putImageData(canvas, 0, 0)
      
      canvasPixels = canvas
    },
    restoreCanvasSize: () => {
      // 캐싱 데이터 사용
      if (!canvasRef.current) return

      canvasRef.current.width = canvasPixels.width
      canvasRef.current.height = canvasPixels.height

      if (canvasContext) {
        canvasContext?.putImageData(canvasPixels, 0, 0)
      }
    },
    clearCanvasSize: () => {
      // 캔버스 크기 제거
      if (!canvasRef.current) return
      
      canvasRef.current.width = 0
      canvasRef.current.height = 0
    }
  }))

  const setPageSize = async () => {
    const currentPageSize = defaultPageSize.current || await context.worker.getPageSize(pageIndex)
    if (!defaultPageSize.current) {
      defaultPageSize.current = currentPageSize
    }
  
    const { scale } = context.sangte.getState()
    const scaledWidth = currentPageSize.width * scale
    const scaledHeight = currentPageSize.height * scale

    const { flow, rootWidth, rootHeight } = context.presentation.layout()
    const widthRatio = rootWidth / scaledWidth
    const heightRatio = rootHeight / scaledHeight
  
    const rootScale = scale === 1 
      ? Math.min(widthRatio, heightRatio)
      : 1
      console.log(rootScale)
  
    const sectionVariables = {
      pageWidth: `${rootWidth}px`,
      pageHeight: flow === 'scrolled' ? `${scaledHeight * rootScale}px` : `${rootHeight}px`
    }
    const containerVariables = {
      pageWidth: `${scaledWidth * rootScale}px`,
      pageHeight: `${scaledHeight * rootScale}px`
    }
  
    setCssVariables(sectionVariables, pageSectionRef.current!)
    setCssVariables(containerVariables, pageContainerRef.current!)
    setCssVariables(containerVariables, canvasRef.current!)
  }
  
  useEffect(() => {
    if (observer && pageSectionRef.current) {
      pageSectionRef.current.dataset.pageIndex = pageIndex.toString()
      observer.observe(pageSectionRef.current)
    }

    return () => {
      if (observer && pageSectionRef.current) {
        observer.unobserve(pageSectionRef.current)
      }
    }
  }, [observer, pageIndex])

  useEffect(() => {
    const handleResize = (event?: Event) => {
      setPageSize()
    }

    handleResize()

    context.oniPDF.on(EVENTS.RESIZE, handleResize)
    return () => {
      context.oniPDF.off(EVENTS.RESIZE, handleResize)
    }
  }, [])

  return (
    <div
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
})

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
