import clsx from 'clsx'
import { useMemo, useEffect, useRef } from 'react'
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

const PageView = ({
  context,
  pageIndex,
  observer
}: PageViewProps) => {
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  
  const defaultPageSize = useRef<Size>(null)
  const pageSectionRef = useRef<HTMLDivElement | null>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

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

  const drawPageAsPixmap = () => {
    try {

    } catch (error) {

    }
  }

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
        <canvas ref={canvasRef} />
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
    background-color: red;
  `
})

export default PageView
