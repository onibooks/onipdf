import { useState, useEffect } from 'react'

import PageView from '../PageView'

import type { GlobalContext } from '../../provider'

type SingleProps = {
  context: GlobalContext
}

const Single = ({
  context
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
          />
        ))
      }
    </>
  )
}

export default Single