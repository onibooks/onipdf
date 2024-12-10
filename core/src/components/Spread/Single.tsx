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

  useEffect(() => {
    ;(async () => {
      const { totalPages } = context.presentation.locate()
      const promises = Array.from({ length: totalPages! })
        .map((_, pageIndex) => (
          context.worker.getPageSize(pageIndex)
        ))

      const pageSizes = await Promise.all(promises)
      context.pageView = pageSizes.map(() => ({
        cached: false,
        size: { top: 0, width: 0, height: 0 }
      }))

      const pageMaxSize = {
        width: Math.round(Math.max(...pageSizes.map(p => p.width)) * 10) / 10,
        height: Math.round(Math.max(...pageSizes.map(p => p.height)) * 10) / 10,
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
    let reflowCount = 0
  
    const handleReflow = (event?: Event) => {
      const { totalPages } = context.presentation.locate()
      reflowCount++
  
      if (reflowCount === totalPages) {
        reflowCount = 0
        context.oniPDF.emit(EVENTS.RELOCATE)
      }
    }
  
    context.oniPDF.on(EVENTS.REFLOW, handleReflow)
    return () => {
      context.oniPDF.off(EVENTS.REFLOW, handleReflow)
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