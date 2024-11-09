import clsx from 'clsx'
import { useMemo, useEffect, useState, useRef } from 'react'
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

  const setScaledPageSize = async () => {
    const { width, height } = await context.worker.getPageSize(pageIndex)
    context.presentation.layout({
      defaultPageWidth: width,
      defaultPageHeight: height
    })

    const { pageWidth, pageHeight } = context.presentation.layout()
  
    const variables = {
      pageWidth: `${pageWidth}px`,
      pageHeight: `${pageHeight}px`,
    }

    if (pageSectionRef.current) {
      setCssVariables(variables, pageSectionRef.current)
    }
  }

  useEffect(() => {
    ;(async () => {
      await setScaledPageSize()
    })()
  }, [])
  
  useEffect(() => {
    const handleResize = async (event?: Event) => {
      await setScaledPageSize()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      className={clsx('page-section', classes.PageSection)}
      ref={pageSectionRef}
    >
    </div>
  )
}

const createClasses = (
  css: Emotion['css']
) => ({
  PageSection: css`
    position: relative;
  `,

  PageContainer: css`
    position: relative;
    top: 0;
  `
})

export default PageView
