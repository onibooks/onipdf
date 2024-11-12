import clsx from 'clsx'
import { useState, useEffect } from 'react'

import PageView from '../PageView'

import type { GlobalContext } from '../../provider'

type DoubleProps = {
  context: GlobalContext
}

const Double = ({
  context
}: DoubleProps) => {
  const { oniPDF } = context
  
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    ;(async () => {
      const totalPages = await oniPDF.getTotalPages()
      setTotalPages(totalPages)
    })()
  }, [])

  return (
    <>
      {totalPages &&
        Array.from({ length: Math.ceil(totalPages / 2) }, (_, spreadIndex) => {
          const firstPageIndex = spreadIndex * 2
          const secondPageIndex = firstPageIndex + 1

          return (
            <div 
              className={clsx(`spread${(spreadIndex + 1)}`)}
              key={spreadIndex}
            >
              <PageView
                context={context}
                pageIndex={firstPageIndex}
              />
              {secondPageIndex < totalPages && (
                <PageView
                  context={context}
                  pageIndex={secondPageIndex}
                />
              )}
            </div>
          )
        })
      }
    </>
  )
}

export default Double