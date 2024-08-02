import './style.css'

import { createBook, EVENTS } from '@onipdf/core'

;(async () => {
  const book = await createBook({
    muPDFSrc: '/lib/mupdf/mupdf.js'
  })
  let index = 0

  const fileInput = document.getElementById('file') as HTMLInputElement
  fileInput?.addEventListener('change', async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files && target.files[0]
    if (file) {
      await book.openDocument(await file.arrayBuffer())
    }
  })

  book.on(EVENTS.OPEN, async () => {
    console.log('Document opened;')

    const metadata = await book.getMetaData()
    const totalPages = await book.getTotalPages()
    console.log('metadata:', metadata)
    console.log('totalPages:', totalPages)

    await book.render(index)
  })
  
  book.on(EVENTS.LOAD, async ({ blobPng }) => {
    console.log('RENDER PAGE', index + 1)
    const container = document.getElementById('container') as HTMLDivElement
    const image = new Image()

    image.src = URL.createObjectURL(new Blob([blobPng], { type: 'image/png' }))
    image.onload = function () {
      image.style.width = image.width / window.devicePixelRatio + 'px'
      container.appendChild(image)
    }
  })
})()