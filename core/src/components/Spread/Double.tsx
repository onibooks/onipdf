import clsx from 'clsx'
import { useMemo, useState, useRef, useEffect } from 'preact/hooks'

import PageView from '../PageView'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../../provider'

type DoubleProps = {
  context: GlobalContext
}

const Double = ({
  context
}: DoubleProps) => {
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const { oniPDF } = context
  const [totalPages, setTotalPages] = useState(0)
  
  const oniBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ;(async () => {
      const totalPages = await oniPDF.getTotalPages()
      setTotalPages(totalPages)
    })()
  }, [])

  return (
    <div
      className={clsx('oni-body', classes.OniBody)}
      ref={oniBodyRef}
    >
      {totalPages &&
        Array.from({ length: Math.ceil(totalPages / 2) }, (_, spreadIndex) => {
          const firstPageIndex = spreadIndex * 2
          const secondPageIndex = firstPageIndex + 1

          return (
            <div 
              className={clsx(`spread${(spreadIndex + 1)}`)}
              key={spreadIndex}
            >
              {/* <PageView
                context={context}
                pageIndex={firstPageIndex}
              />
              {secondPageIndex < totalPages && (
                <PageView
                  context={context}
                  pageIndex={secondPageIndex}
                />
              )} */}
            </div>
          )
        })
      }
    </div>
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

export default Double