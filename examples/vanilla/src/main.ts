import './style.css'

import { createBook } from '@onipdf/core'

;(async () => {
  const oniPDF = await createBook({
    muPDFSrc: '/lib/mupdf/mupdf.js'
  })

  const fileInput = document.getElementById('file') as HTMLInputElement
  fileInput?.addEventListener('change', async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files && target.files[0]
    if (file) {
      await oniPDF.openDocument(await file.arrayBuffer())

      const metadata = await oniPDF.getMetaData()
      const totalPages = await oniPDF.getTotalPages()
      console.log(metadata, totalPages)
    }
  })
})()