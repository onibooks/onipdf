import './style.css'
// import './resizer'

import { createBook, EVENTS } from '@onipdf/core'

;(async () => {
  const oniPdf = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js'
  })

  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened;')

    const metadata = await oniPdf.getMetaData()
    const totalPages = await oniPdf.getTotalPages()
    console.log(metadata, totalPages)

    await oniPdf.loadPage(0)
    await oniPdf.renderToCanvas(0)

    // 전체 페이지 렌더링
    // 전체 페이지에 대한 로드를 해준다.
    // await oniPdf.render(document.getElementById('reader')!, {
    //   type: 'canvas',
    //   page: index
    // })
  })
  
  oniPdf.on(EVENTS.LOAD, async () => {
    console.log('LOAD PAGE')
  })

  oniPdf.on(EVENTS.RENDERED, async (data) => {
    console.log('RENDERED PAGE', data)
  })

  // @ts-ignore
  window.oniPdf = oniPdf
})()
