import clsx from 'clsx'
import { render as prender } from 'preact'
import { useMemo, useRef, useEffect } from 'preact/hooks'
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
  const { presentation } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const oniBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const { totalPages } = presentation.locate()
      const promises = Array.from({ length: totalPages! }).map((_, pageIndex) =>
        context.worker.getPageSize(pageIndex)
      )
      const pageSizes = await Promise.all(promises)
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
  
      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map((p) => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map((p) => p.height)) * 10) / 10,
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
      const { isReady: isReadyOnce } = context.sangte.getState()
      const eventName = isReadyOnce ? EVENTS.LAYOUT : EVENTS.READY
      context.oniPDF.emit(eventName, oniBodyRef.current)
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
    transition: opacity 0.45s;

    .paginated & {
      display : flex;
    }
  `
})


export default Single