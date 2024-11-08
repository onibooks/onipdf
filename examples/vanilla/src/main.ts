import './style.css'
import { createBook, EVENTS, OniPDF } from '@onipdf/core'

type ViewType = 'flow' | 'spread'
type ViewElement = 'scrolled' | 'paginated' | 'single' | 'double' | 'coverFacing'

const renderOptions = {
  page: 10,
  layout: {
    flow: 'paginated',
    spread: 'single',
    zoom: 1
  }
} as const

async function initializePdfViewer(): Promise<OniPDF> {
  const oniPdf: OniPDF = await createBook('/books/대치동 아이들은 이렇게 공부합니다.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js',
  })

  // @ts-ignore
  window.oniPdf = oniPdf

  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened')
    await oniPdf.render(document.querySelector('.document-container')!, renderOptions)
  })

  oniPdf.on(EVENTS.RENDERED, async () => {
    console.log('Rendered page')
    
    updateZoomDisplay()
  })

  return oniPdf
}

function updateZoomDisplay (): void {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  const textarea = document.querySelector('.textarea') as HTMLTextAreaElement
  const currentZoom = oniPdf.getZoom()

  textarea.value = Math.round(currentZoom * 100).toString()
}

function setupEventHandlers(): void {
  const header = document.querySelector('.header-items') as HTMLElement
  const overlayMenu = document.querySelector('.overlay-menu') as HTMLElement
  const textarea = document.querySelector('.textarea') as HTMLTextAreaElement
  const actionButtons = document.querySelectorAll('.action-button')

  header?.addEventListener('click', handleButtonClick)
  overlayMenu?.addEventListener('click', handleMenuClick)
  textarea?.addEventListener('change', handleChangeScale)

  actionButtons.forEach((button) => {
    const elementType = (button as HTMLElement).dataset.element as 'zoomOutButton' | 'zoomInButton'
    button.addEventListener('click', () => handleActionButtonClick(elementType))
  })
}

function handleActionButtonClick(elementType: 'zoomOutButton' | 'zoomInButton'): void {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  let zoom = oniPdf.getZoom()

  const zoomChange = elementType === 'zoomOutButton' ? -0.1 : 0.1
  zoom = Math.max(0.1, Math.min(2, zoom + zoomChange))
  zoom = Math.round(zoom * 100) / 100

  const textarea = document.querySelector('.textarea') as HTMLTextAreaElement
  textarea.value = Math.round(zoom * 100).toString()

  oniPdf.layout({ zoom })
}

function handleButtonClick(event: Event): void {
  const button = (event.target as HTMLElement).closest('button') as HTMLButtonElement | null
  if (!button) return

  const overlayMenu = document.querySelector('.overlay-menu') as HTMLElement
  toggleButtonActiveState(button)
  toggleOverlayMenu(button, overlayMenu)
}

function handleMenuClick(event: Event): void {
  const button = (event.target as HTMLElement).closest('button') as HTMLButtonElement | null
  if (!button) return

  const viewElement = button.dataset.element as ViewElement
  const viewType = button.dataset.type as ViewType

  setViewControls(viewElement, viewType)
  const overlayMenu = document.querySelector('.overlay-menu') as HTMLElement
  toggleOverlayMenu(button, overlayMenu, false)
}

function handleChangeScale(event: Event): void {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  const input = event.target as HTMLInputElement
  let numeric = Number(input.value.trim())

  if (isNaN(numeric)) numeric = 100

  numeric = Math.min(Math.max(10, numeric), 200)
  input.value = String(numeric)

  const scale = numeric / 100
  oniPdf.layout({ zoom: scale })
}

function toggleButtonActiveState(button: HTMLButtonElement): void {
  button.classList.toggle('active')
}

function toggleOverlayMenu(button: HTMLButtonElement, overlayMenu: HTMLElement, isVisible = true): void {
  if (button.classList.contains('controls-button') && isVisible) {
    overlayMenu.classList.toggle('active', button.classList.contains('active'))
  } else {
    overlayMenu.classList.remove('active')
  }
}

async function setViewControls(viewElement: ViewElement, viewType: ViewType): Promise<void> {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  if (viewElement && oniPdf) {
    await oniPdf.layout({ [viewType]: viewElement })
  }
}

function initializeSettings(): void {
  // @ts-ignore
  const oniPdf: OniPDF = window.oniPdf

  updateZoomDisplay()
}

(async () => {
  await initializePdfViewer()
  initializeSettings()
  setupEventHandlers()
})()
