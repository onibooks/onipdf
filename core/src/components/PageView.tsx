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
  const [getScaledPageSize, setGetScaledPageSize] = useState<() => Size>(() => () => null)
  const [getPageSize, setGetPageSize] = useState<() => Size>(() => () => null)
  const pageSectionRef = useRef(null)

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

  useEffect(() => {
    ;(async () => {
      await setScaledPageSize()
    })()
  }, [])

  useEffect(() => {
    if (getScaledPageSize()) {
      const pageSize = getScaledPageSize()
      if (pageSize) {
        // 이 값이 바뀌면 여기도 같이 업데이트 되어야 한다.
        const { rootWidth, rootHeight } = context.presentation.layout()

        const pageWidth = rootWidth / pageSize.width
        const pageHeight = rootHeight / pageSize.height
        const minRootScale = Math.min(pageWidth, pageHeight)
        const { scale } = context.sangte.getState()
        
        const variables = {
          pageWidth: `${pageSize.width * (scale === 1 ? minRootScale : 1)}px`,
          pageHeight: `${pageSize.height * (scale === 1 ? minRootScale : 1)}px`,
        }

        if (pageSectionRef.current) {
          setCssVariables(variables, pageSectionRef.current)
        }
      }
    }
  }, [getScaledPageSize])

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
