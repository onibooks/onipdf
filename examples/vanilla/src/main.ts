import './style.css'

import { createBook, EVENTS } from '@onipdf/core'

;(async () => {
  const oniPdf = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js'
  })
  const index = 0
  
  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened;')

    const metadata = await oniPdf.getMetaData()
    const totalPages = await oniPdf.getTotalPages()
    console.log(metadata, totalPages)

    await oniPdf.loadPage(index)
    await oniPdf.render(document.getElementById('app')!)
  })
  
  oniPdf.on(EVENTS.LOAD, async ({ data }) => {
    console.log('LOAD PAGE', data)
  })

  // oniPdf.on(EVENTS.RENDERED, ({ drawPromise }) => {
  //   console.log('RENDERED', drawPromise)
  // })

  // @ts-ignore
  window.oniPdf = oniPdf
})()


// const container = document.getElementById('container') as HTMLDivElement
// const image = new Image()

// image.src = URL.createObjectURL(new Blob([data.blobPng], { type: 'image/png' }))
// image.onload = function () {
//   image.style.width = image.width / window.devicePixelRatio + 'px'
//   container.appendChild(image)
// }