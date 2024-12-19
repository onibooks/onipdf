import clsx from 'clsx'
import { render as prender } from 'preact'
import { memo } from 'preact/compat'
import { useMemo, useRef, useEffect } from 'preact/hooks'
import { EVENTS } from '../../constants'
import { updateScrollPosition } from '../../utils/updateScrollPosition'

import PageView from '../PageView2'

import type { GlobalContext, SpreadPage, PageView as PageViewType } from '../../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type DoubleProps = {
  context: GlobalContext
}

const Double = ({
  context
}: DoubleProps) => {
  const { oniPDF, presentation } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const oniBodyRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef({ leftRatio: 0, topRatio: 0 })

  useEffect(() => {
    ;(async () => {
      const { totalPages } = presentation.locate()
      const promises = Array.from({ length: totalPages! })
        .map((_, pageIndex) => (
          context.worker.getPageSize(pageIndex)
        ))

      const pageSizes = await Promise.all(promises)
      context.pageViews = pageSizes.reduce<SpreadPage[]>((acc, _, index) => {
        if (index % 2 === 0) {
          const spread: SpreadPage = {
            index: acc.length,
            cached: false,
            rect: { top: 0, width: 0, height: 0 },
            pages: [
              pageSizes[index]
                ? {
                    rect: { ...pageSizes[index], top: 0 },
                    pageIndex: index,
                  }
                : null,
              pageSizes[index + 1]
                ? {
                    rect: { ...pageSizes[index + 1], top: 0 },
                    pageIndex: index + 1,
                  }
                : null,
            ].filter(Boolean) as PageViewType[],
          }

          acc.push(spread)
        }

        return acc
      }, [])

      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map(p => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map(p => p.height)) * 10) / 10
      }

      const rendered = context.pageViews.map((spread) => (
        new Promise((resolve, reject) => {
          const fragment = document.createElement('div')
          
          prender(
            <div 
              data-index={spread.index}
              className={clsx('spread', classes.OniSpread)}
            >
              {spread.pages.map(({ rect, pageIndex }) => (
                <PageView
                  key={pageIndex}
                  context={context}
                  pageMaxSize={pageMaxSize}
                  pageSize={rect}
                  pageIndex={pageIndex!}
                  pageRender={resolve}
                />
              ))}
            </div>,
            fragment
          )

          oniBodyRef.current?.appendChild(
            fragment.firstChild as HTMLElement
          )
        })
      ))

      await Promise.all(rendered)

      const { isReady: isReadyOnce } = context.sangte.getState()
      const eventName = isReadyOnce ? EVENTS.LAYOUT : EVENTS.READY
      context.oniPDF.emit(eventName, oniBodyRef.current)
    })()
  }, [])

  useEffect(() => {
    // const updateScrollPosition = () => {
    //   const { flow } = presentation.layout()

    //   if (flow === 'scrolled') {
    //     const { scrollTop, scrollHeight } = context.documentElement
    //     scrollPositionRef.current = {
    //       leftRatio: 0,
    //       topRatio: scrollTop / scrollHeight || 0
    //     }
    //   } else {
    //     const { scrollLeft, scrollWidth } = context.documentElement
    //     scrollPositionRef.current = {
    //       leftRatio: scrollLeft / scrollWidth || 0,
    //       topRatio: 0
    //     }
    //   }
    // }

    const handleResize = () => {
      scrollPositionRef.current = updateScrollPosition()

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
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: visible;
    .paginated & {
      display : flex;
    }
  `,

  OniSpread: css`
    display: flex;
  `
})

export default Double