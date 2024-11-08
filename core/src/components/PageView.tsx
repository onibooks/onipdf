import { useEffect, useState } from 'react'
import type { GlobalContext } from '../provider'

type Size = {
  width: number
  height: number
}

type PageViewProps = {
  context: GlobalContext
  pageIndex: number
}

const PageView = ({
  context,
  pageIndex
}: PageViewProps) => {
  const [getScaledPageSize, setGetScaledPageSize] = useState(() => () => {})

  useEffect(() => {
    ;(async () => {
      const { width, height } = await context.worker.getPageSize(pageIndex)
      setGetScaledPageSize(() => {
        return () => {
          const { scale } = context.sangte.getState()
          return {
            width: width * scale,
            height: height * scale
          }
        }
      })
    })()
  }, [])

  return (
    <div></div>
  )
}

export default PageView