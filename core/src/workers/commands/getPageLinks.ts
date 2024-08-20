import type { WorkerContext } from '../worker.js'

export const getPageLinks = (context: WorkerContext) => (index: number) => {
  const PDFPage = context.PDFPages[index]
  
  const links = PDFPage.getLinks()
  const pageLinks = links.map((link: any) => {
    const [x0, y0, x1, y1] = link.getBounds()
    let href

    if (link.isExternal()) {
      href = link.getURI()
    } else {
      href = `#page${context.document.resolveLink(link) + 1}`
    }

    return {
      x: x0,
      y: y0,
			w: x1 - x0,
			h: y1 - y0,
			href,
    }
  })

  return pageLinks
}
