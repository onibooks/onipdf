import * as MuPDF from 'mupdf'

self.onmessage = async (event) => {
  const { type, muPDFSrc } = event.data
  if (type === 'init') {
    try {
      const mupdf: typeof MuPDF = await import(muPDFSrc)
    } catch (error) {
    }
  }
};
