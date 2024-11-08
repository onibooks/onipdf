import clsx from 'clsx'
import { useMemo, useEffect, useState } from 'react'

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
  const [getScaledPageSize, setGetScaledPageSize] = useState<() => Size>(() => () => null)
  const [getPageSize, setGetPageSize] = useState<() => Size>(() => () => null)

  const setScaledPageSize = async () => {
    const { width, height } = await context.worker.getPageSize(pageIndex)
    setGetScaledPageSize(() => {
      return () => {
        const { scale } = context.sangte.getState()
        return {
          width: width * scale,
          height: height * scale,
        }
      }
    })
  }

  const updatePageSize = () => {
    const scaledPageSize = getScaledPageSize()
    if (scaledPageSize) {
      const { width: scaledWidth, height: scaledHeight } = scaledPageSize
      const { width: rootWidth, height: rootHeight} = context.rootElementSize

      const pageWidth = rootWidth / scaledWidth
      const pageHeight = rootHeight / scaledHeight
      const minRootScale = Math.min(pageWidth, pageHeight)

      setGetPageSize(() => {
        return () => {
          const { scale } = context.sangte.getState()
          return {
            width: scaledWidth * (scale === 1 ? minRootScale : 1),
            height: scaledHeight * (scale === 1 ? minRootScale : 1),
          }
        }
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      await setScaledPageSize()
    })()
  }, [])

  useEffect(() => {
    if (getScaledPageSize()) {
      updatePageSize()
    }
  }, [getScaledPageSize])

  return (
    <div 
      className={clsx('page-section', classes.PageSection)}
      style={
        getPageSize() ? {
          width: getPageSize()!.width,
          height: getPageSize()!.height
        } : undefined
      }
    >
      <div 
        className={clsx('page-container', classes.PageContainer)}
        style={
          getPageSize() ? {
            width: getPageSize()!.width,
            height: getPageSize()!.height
          } : undefined
        }
      ></div>
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
