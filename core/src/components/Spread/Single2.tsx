import clsx from 'clsx'
import { render as prender } from 'preact'
import { useEffect, useRef, useMemo } from 'preact/hooks'
import { EVENTS } from '../../constants'

import PageView from '../PageView2'

import type { GlobalContext, SpreadPage } from '../../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type SingleProps = {
  context: GlobalContext
}

const Single = ({
  context
}: SingleProps) => {
  const { oniPDF, presentation } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const oniBodyRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef({ leftRatio: 0, topRatio: 0 })

  useEffect(() => {
    ;(async () => {
      const { totalPages } = context.presentation.locate()
      const promises = Array.from({ length: totalPages! })
        .map((_, pageIndex) => (
          context.worker.getPageSize(pageIndex)
        ))

      const pageSizes = await Promise.all(promises)
      context.pageViews = pageSizes.map<SpreadPage>((size, index) => ({
        index,
        cached: false,
        rect: { ...size, top: 0 },
        pages: [
          {
            rect: { ...size, top: 0 },
            pageIndex: index
          },
        ],
      }))

      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map(p => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map(p => p.height)) * 10) / 10
      }
      
      const rendered = context.pageViews.map(({ pages }) => (
        new Promise((resolve, reject) => {
          const fragment = document.createElement('div')
          
          {pages.map(({ rect, pageIndex }) => (
            prender(
              <PageView
                context={context}
                pageMaxSize={pageMaxSize}
                pageSize={rect}
                pageIndex={pageIndex!}
                pageRender={resolve}
              />,
              fragment
            )
          ))}

          oniBodyRef.current?.appendChild(
            fragment.firstChild as HTMLElement
          )
        })
      ))

      await Promise.all(rendered)

      // PDF 렌더링 준비 완료
      oniPDF.emit(EVENTS.READY, oniBodyRef.current)
    })()
  }, [])

  useEffect(() => {
    const updateScrollPosition = () => {
      const oniBody = oniBodyRef.current
      if (!oniBody) return

      const { flow } = presentation.layout()
      if (flow === 'scrolled') {
        const { scrollTop, scrollHeight } = context.documentElement
        scrollPositionRef.current = {
          leftRatio: 0,
          topRatio: scrollTop / scrollHeight || 0
        }
      } else {
        const { scrollLeft, scrollWidth } = context.documentElement
        scrollPositionRef.current = {
          leftRatio: scrollLeft / scrollWidth || 0,
          topRatio: 0
        }
      }
    }

    const handleResize = () => {
      updateScrollPosition()

      oniPDF.emit(EVENTS.FORCERESIZE, scrollPositionRef.current)
    }
  
    oniPDF.on(EVENTS.RESIZE, handleResize)
    return () => {
      oniPDF.off(EVENTS.RESIZE, handleResize)
    }
  }, [])

  return (
    <div
      className={clsx('oni-body', classes.OniBody)}
      ref={oniBodyRef}
    />
  )
}

const createClasses = (
  css: Emotion['css'],
) => ({
  OniBody: css`
    transition: opacity 0.45s;

    .paginated & {
      display : flex;
    }
  `
})


export default Single