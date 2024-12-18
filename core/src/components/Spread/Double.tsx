import clsx from 'clsx'
import { render as prender } from 'preact'
import { useMemo, useRef, useEffect } from 'preact/hooks'
import { EVENTS } from '../../constants'

import PageView from '../PageView2'

import type { GlobalContext, PageView as PageViewType, SpreadPage } from '../../provider'
import type { Emotion } from '@emotion/css/types/create-instance'
import type { Spread } from '../../presentation/layout/createLayout'

type DoubleProps = {
  context: GlobalContext
}

const Double = ({
  context
}: DoubleProps) => {
  const { presentation } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const oniBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const { totalPages } = presentation.locate()
      const { spread } = presentation.layout()

      const promises = Array.from({ length: totalPages! })
        .map((_, pageIndex) => (
          context.worker.getPageSize(pageIndex)
        ))

      const pageSizes = await Promise.all(promises)
      const updatePageViewsForMode = (mode: Spread) => {
        if (mode !== 'single') {
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
                ].filter(Boolean) as PageViewType[]
              }
      
              acc.push(spread)
            }

            return acc
          }, [])
        } else {
          context.pageViews = pageSizes.map<SpreadPage>((size, index) => ({
            index,
            cached: false,
            rect: { top: 0, width: 0, height: 0 },
            pages: [
              {
                rect: { ...size, top: 0 },
                pageIndex: index,
              },
            ],
          }))
        }
      }

      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map(p => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map(p => p.height)) * 10) / 10
      }

      updatePageViewsForMode(spread!)

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
      
      // PDF 렌더링 준비 완료
      context.oniPDF.emit(EVENTS.READY, oniBodyRef.current)
    })()
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