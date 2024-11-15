import { useState, useEffect } from 'react'

import PageView from '../PageView'

import type { GlobalContext } from '../../provider'

type SingleProps = {
  context: GlobalContext
  observer: IntersectionObserver | null
  pageViewRefs: any
}

const Single = ({
  context,
  observer,
  pageViewRefs
}: SingleProps) => {
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
        Array.from({ length: totalPages }).map((_, pageIndex) => (
          <PageView
          key={pageIndex}
          context={context}
          pageIndex={pageIndex}
          observer={observer}
          ref={(ref: any) => {
            if (ref) {
              pageViewRefs.current.set(pageIndex, ref)
            } else {
              pageViewRefs.current.delete(pageIndex)
            }
          }}
        />
        ))
      }
    </>
  )
}

export default Single