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
      const promises = Array.from({ length: context.totalPages })
        .map((_, pageIndex) => (
          context.worker.getPageSize(pageIndex)
        ))

      const pageSizes = await Promise.all(promises)
      const rendered = pageSizes.map((pageSize, pageIndex) => (
        new Promise((resolve, reject) => {
          const fragment = document.createElement('div')

          prender(
            <PageView
              context={context}
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
      context.oniPDF.emit(EVENTS.READY)
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
  `
})


export default Single