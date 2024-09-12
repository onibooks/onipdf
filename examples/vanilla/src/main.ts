import './style.css'

import { createBook, EVENTS } from '@onipdf/core'

type ViewControls = 'scrolledFlow' | 'paginatedFlow' | 'singleSpread' | 'doubleSpread' | 'coverFacingSpread'

(() => {
  const header = document.querySelector('.header-items')
  const buttons = document.querySelectorAll('.header-items > button')
  const overlayMenu = document.querySelector('.overlay-menu')

  header?.addEventListener('click', handleButtonClick)
  overlayMenu?.addEventListener('click', handleMenuClick)


  function handleButtonClick(event: Event) {
    const button = (event.target as HTMLElement)?.closest('button') as HTMLButtonElement
    if (!button) return

    const isControlsButton = button.classList.contains('controls-button')
    const isActive = button.classList.contains('active')

    buttons.forEach(btn => btn.classList.remove('active'))

    if (!isActive && !button.classList.contains('action-button')) {
      button.classList.add('active')
    }

    toggleOverlayMenu(isControlsButton && button.classList.contains('active'))
  }

  function handleMenuClick(event: Event) {
    const button = (event.target as HTMLElement)?.closest('button') as HTMLButtonElement
    if (!button) return

    const viewControlElement = button.dataset.element as ViewControls
    setViewControls(viewControlElement)

    overlayMenu?.classList.remove('active')
  }

  function toggleOverlayMenu(isActive: boolean) {
    if (isActive) {
      overlayMenu?.classList.add('active')
    } else {
      overlayMenu?.classList.remove('active')
    }
  }

  function setViewControls(element: ViewControls) {
    if (element) {
      console.log(element)
    }
  }
})()

;(async () => {
  const oniPdf = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js',
  })

  const index = 1

  oniPdf.on(EVENTS.OPEN, async () => {
    console.log('Document opened;')

    const metadata = await oniPdf.getMetaData()
    const totalPages = await oniPdf.getTotalPages()
    console.log(metadata, totalPages)

    await oniPdf.loadPage(index)
    await oniPdf.render(document.querySelector('.document-container')!, { page: index })
  })
  
  // oniPdf.on(EVENTS.LOAD, async () => {})
  // oniPdf.on(EVENTS.RENDERED, async ({ page }) => {})

  // @ts-ignore
  window.oniPdf = oniPdf
})()
