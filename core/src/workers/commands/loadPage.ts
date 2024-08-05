import type { WorkerContext } from '../worker.js'

export const loadPage = (context: WorkerContext) => (devicePixelRatio: any, index: number = 0) => {
  const page = context.document.loadPage(index)
  
  // pageSize
  const bounds = page.getBounds()
  const pageSize = {
    width: bounds[2] - bounds[0],
    height: bounds[3] - bounds[1]
  }
  
  // pageText
  const text = page.toStructuredText().asJSON()
  const pageText = JSON.parse(text)

  // pageLinks
  const links = page.getLinks()
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

  // rendering 할 때 필요
  const { ColorSpace } = context.mupdf
  const z = devicePixelRatio * 96 / 72
  const pixmap = page.toPixmap([z, 0, 0, z, 0, 0], ColorSpace.DeviceRGB, true, true)
	
  return {
    page,
    pageSize,
    pageText,
    pageLinks,
    pixmap
  }
}