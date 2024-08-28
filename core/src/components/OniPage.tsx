import clsx from 'clsx'
import { useState, useEffect, forwardRef } from 'preact/compat'

import type { GlobalContext } from '../provider'
import { EVENTS } from '../constants'

type OniPageProps = {
  context: GlobalContext
  index: number
}

const OniPage = forwardRef<HTMLDivElement, OniPageProps>(({ context, index }, ref) => {
  const { oniPDF, pageViews } = context
  const pageView = pageViews[index]
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    pageView.getPageSize()
      .then(setPageSize)
  }, [pageView, oniPDF])

  return (
    <div className={clsx('page')} ref={ref} data-index={index} style={{ ...pageSize }}></div>
  )
})

export default OniPage
