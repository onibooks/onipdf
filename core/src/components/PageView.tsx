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
}

const PageView = ({
  context,
  pageIndex
}: PageViewProps) => {
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const pageSectionRef = useRef(null)

  const defaultPageSize = useRef<Size>(null)

  const setPageSize = async () => {
    const currentPageSize = defaultPageSize.current || await context.worker.getPageSize(pageIndex)
    if (!defaultPageSize.current) {
      defaultPageSize.current = currentPageSize
    }
  
    const { scale } = context.sangte.getState()
    const scaledWidth = currentPageSize.width * scale
    const scaledHeight = currentPageSize.height * scale

    const { rootWidth, rootHeight } = context.presentation.layout()
    const widthRatio = rootWidth / scaledWidth
    const heightRatio = rootHeight / scaledHeight
  
    const rootScale = scale === 1 
      ? Math.min(widthRatio, heightRatio)
      : 1
  
    const cssVariables = {
      pageWidth: `${scaledWidth * rootScale}px`,
      pageHeight: `${scaledHeight * rootScale}px`,
    }
  
    setCssVariables(cssVariables, pageSectionRef.current!)
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
      <div className={clsx('page-container', classes.PageContainer)}></div>
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
