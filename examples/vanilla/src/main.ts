import './style.css'
import { createBook, EVENTS, OniPDF } from '@onipdf/core'

const oniPdf = await createBook('/books/179489140.pdf', {
  muPDFSrc: '/lib/mupdf/mupdf.js',
})

console.log(oniPdf)