import clsx from 'clsx'
import { useState, useEffect, forwardRef } from 'preact/compat'

import type { GlobalContext } from '../provider'
import { EVENTS } from '../constants'
import { useRef } from 'react'

type OniPageProps = {
  context: GlobalContext
  index: number
}

const OniPage = forwardRef<HTMLDivElement, OniPageProps>(({ context, index }, ref) => {
  const { oniPDF, pageViews } = context
  const pageView = pageViews[index]
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    pageView.getPageSize()
      .then(setPageSize)
  }, [pageView, oniPDF])

  useEffect(() => {
    const handleFirstRendered = () => {
      if (pageRef.current) {
        const io = new IntersectionObserver((entries, observer) => {
          entries.forEach(async entry => {
            const target = entry.target as HTMLElement | null
            const page = Number(target?.dataset.index)

            if (entry.isIntersecting) {
              const canvasNode = await oniPDF.renderToCanvas(page)
              target?.appendChild(canvasNode)
            }
          })
        }, {
          root: context.scrollingElement,
          rootMargin: '30%',
        })

        io.observe(pageRef.current)

        return () => io.disconnect()
      }
    }

    oniPDF.on(EVENTS.FIRSTRENDERED, handleFirstRendered)

    return () => oniPDF.off(EVENTS.FIRSTRENDERED, handleFirstRendered)
  }, [oniPDF])

  return (
    <div 
      className={clsx('page')} 
      ref={(node) => {
        pageRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      }} 
      data-index={index}
      style={{ ...pageSize }}
    />
  )
})

export default OniPage
