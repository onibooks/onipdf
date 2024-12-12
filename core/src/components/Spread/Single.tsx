import clsx from 'clsx'
import { useEffect, useRef, useMemo } from 'preact/hooks'
import { render as prender } from 'preact'
import { EVENTS } from '../../constants'

import PageView from '../PageView'

import type { GlobalContext } from '../../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type SingleProps = {
  context: GlobalContext
}

const Single = ({
  context
}: SingleProps) => {
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
      context.pageViews = pageSizes.map(() => ({
        cached: false,
        size: { top: 0, width: 0, height: 0 }
      }))

      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map(p => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map(p => p.height)) * 10) / 10
      }
      
      const rendered = pageSizes.map((pageSize, pageIndex) => (
        new Promise((resolve, reject) => {
          const fragment = document.createElement('div')

          prender(
            <PageView
              context={context}
              pageMaxSize={pageMaxSize}
              pageSize={pageSize}
              pageIndex={pageIndex}
              pageRender={resolve}
            />,
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

  useEffect(() => {
    const updateScrollPosition = () => {
      const oniBody = oniBodyRef.current
      if (!oniBody) return
      
      const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = context.documentElement
      scrollPositionRef.current = {
        leftRatio: scrollLeft / scrollWidth || 0,
        topRatio: scrollTop / scrollHeight || 0
      }
    }

    const handleResize = () => {
      updateScrollPosition()
  
      context.oniPDF.emit(EVENTS.FORCERESIZE, scrollPositionRef.current)
    }

    const handleResized = () => {
      const oniBody = oniBodyRef.current
      if (!oniBody) return
  
      context.oniPDF.emit(EVENTS.FORCERESIZED, scrollPositionRef.current)
    }
  
    context.oniPDF.on(EVENTS.RESIZE, handleResize)
    context.oniPDF.on(EVENTS.RESIZED, handleResized)
    return () => {
      context.oniPDF.off(EVENTS.RESIZE, handleResize)
      context.oniPDF.off(EVENTS.RESIZED, handleResized)
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