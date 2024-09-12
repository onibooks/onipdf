import './style.css'
import { createBook, EVENTS, OniPDF } from '@onipdf/core'

type ViewType = 'flow' | 'spread'
type ViewElement = 'scrolled' | 'paginated' | 'single' | 'double' | 'coverFacing'

async function initializePdfViewer (): Promise<OniPDF> {
  const oniPdf: OniPDF = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js',
  })

  // @ts-ignore
  window.oniPdf = oniPdf

  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened')

    await oniPdf.loadPage(1)
    await oniPdf.render(document.querySelector('.document-container')!, { page: 1 })
  })

  return oniPdf
}

function setupEventHandlers (): void {
  const header = document.querySelector('.header-items') as HTMLElement
  const overlayMenu = document.querySelector('.overlay-menu') as HTMLElement

  header?.addEventListener('click', event => handleButtonClick(event))
  overlayMenu?.addEventListener('click', event => handleMenuClick(event))

  function handleButtonClick (event: Event): void {
    const button = (event.target as HTMLElement).closest('button') as HTMLButtonElement | null
    if (!button) return

    toggleButtonActiveState(button)
    toggleOverlayMenu(button, overlayMenu)
  }

  function handleMenuClick (event: Event): void {
    const button = (event.target as HTMLElement).closest('button') as HTMLButtonElement | null
    if (!button) return

    const viewElement = button.dataset.element as ViewElement
    const viewType = button.dataset.type as ViewType

    setViewControls(viewElement, viewType)
    toggleOverlayMenu(button, overlayMenu, false)
  }
}

function toggleButtonActiveState (button: HTMLButtonElement): void {
  button.classList.toggle('active', !button.classList.contains('active'))
}

function toggleOverlayMenu (button: HTMLButtonElement, overlayMenu: HTMLElement, isVisible: boolean = true): void {
  if (button.classList.contains('controls-button') && isVisible) {
    overlayMenu.classList.toggle('active', button.classList.contains('active'))
  } else {
    overlayMenu.classList.remove('active')
  }
}

async function setViewControls (viewElement: ViewElement, viewType: ViewType): Promise<void> {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  
  if (viewElement && oniPdf) {
    await oniPdf.layout({
      [viewType]: viewElement
    })
  }
}

async function main (): Promise<void> {
  await initializePdfViewer()
  setupEventHandlers()
}

document.addEventListener('DOMContentLoaded', main)
