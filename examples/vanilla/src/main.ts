import './style.css'
import { createBook, EVENTS, OniPDF } from '@onipdf/core'

type ViewType = 'flow' | 'spread'
type ViewElement = 'scrolled' | 'paginated' | 'single' | 'double' | 'coverFacing'

const renderOptions = {
  page: 0,
  zoom: 1
}

async function initializePdfViewer (): Promise<OniPDF> {
  const oniPdf: OniPDF = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js',
  })

  // @ts-ignore
  window.oniPdf = oniPdf

  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened')
    
    // await oniPdf.loadPage(index)
    await oniPdf.render(document.querySelector('.document-container')!, renderOptions)
  })
  
  return oniPdf
}

function setupEventHandlers (): void {
  const header = document.querySelector('.header-items') as HTMLElement
  const overlayMenu = document.querySelector('.overlay-menu') as HTMLElement
  const textarea = document.querySelector('.textarea') as HTMLTextAreaElement
  const actionButtons = document.querySelectorAll('.action-button')

  header?.addEventListener('click', event => handleButtonClick(event))
  overlayMenu?.addEventListener('click', event => handleMenuClick(event))
  textarea?.addEventListener('change', event => handleChangeScale(event))
  actionButtons.forEach((button) => {
    const elementType = (button as HTMLElement).dataset.element as 'zoomOutButton' | 'zoomInButton'
    button.addEventListener('click', () => handleActionButtonClick(elementType))
  })

  function handleActionButtonClick (elementType: 'zoomOutButton' | 'zoomInButton') {
    // @ts-ignore
    const oniPdf = window.oniPdf as OniPDF
    let zoom = oniPdf.getZoom()

    const zoomChange = elementType === 'zoomOutButton' ? -0.1 : 0.1
    zoom = Math.max(0.1, Math.min(2, zoom + zoomChange))
    zoom = Math.round(zoom * 100) / 100

    textarea.value = Math.round(zoom * 100).toString()
    
    oniPdf.layout({ zoom })
  }

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

  function handleChangeScale (event: Event) {
    // @ts-ignore
    const oniPdf = window.oniPdf as OniPDF
    const input = event.target as HTMLInputElement
    let value = input.value.trim()
    let numeric = Number(value)

    if (isNaN(numeric)) {
      numeric = 100
    }

    numeric = Math.min(Math.max(10, numeric), 200)
    input.value = String(numeric)

    const scale = numeric / 100
    oniPdf.layout({
      zoom: scale
    })
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
