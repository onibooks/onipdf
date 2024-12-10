import './style.css'
import { createBook, EVENTS, OniPDF } from '@onipdf/core'

type ViewType = 'flow' | 'spread'
type FlowType = 'scrolled' | 'paginated'
type SpreadType = 'single' | 'double' | 'coverFacing'
type ViewElement = FlowType | SpreadType

const renderOptions = {
  locate: {
    currentPage: 10,
  },
  layout: {
    flow: 'scrolled' as FlowType,
    spread: 'single' as SpreadType,
    zoom: 1
  }
} as const

async function initializePdfViewer(): Promise<OniPDF> {
  const oniPdf: OniPDF = await createBook('/books/대치동 아이들은 이렇게 공부합니다.pdf', {
  // const oniPdf: OniPDF = await createBook('/books/179489140.pdf', {
    muPDFSrc: '/lib/mupdf/mupdf.js',
  })

  // @ts-ignore
  window.oniPdf = oniPdf

  oniPdf.on(EVENTS.OPEN, async () => {
    // console.log('Document opened')
    await oniPdf.render(document.querySelector('.document-container')!, renderOptions)
  })

  oniPdf.on(EVENTS.READY, () => {
    // console.log('Document ready')
  })

  oniPdf.on(EVENTS.RENDER, async () => {
    // console.log('Rendered page')
    // @ts-ignore
    const oniPdf = window.oniPdf as OniPDF
    const { flow, spread } = oniPdf.layout()
    
    updateRadioButtons(flow!, spread!)  
    updateZoomDisplay()
  })
  
  return oniPdf
}

function setupEventHandlers(): void {
  const radios = document.querySelectorAll('.switch-field input[type="radio"]')
  
  radios.forEach((radio) =>
    radio.addEventListener('change', ({ target }) => {
      const input = target as HTMLInputElement
      if (input.checked) {
        const viewElement = input.value as ViewElement
        const viewType = input.name as ViewType
        setViewControls(viewElement, viewType)
      }
    })
  )
}

function setViewControls(viewElement: ViewElement, viewType: ViewType) {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  if (viewElement && oniPdf) {
    const { flow, spread } = oniPdf.layout({ [viewType]: viewElement })
    console.log(`flow: ${flow}`, `spread: ${spread}`)
  }
}

function updateRadioButtons(flow: FlowType, spread: SpreadType): void {
  const radios = document.querySelectorAll('.switch-field input[type="radio"]')

  radios.forEach((radio) => {
    const input = radio as HTMLInputElement
    if (input.name === 'flow' && input.value === flow) {
      input.checked = true
    }
    if (input.name === 'spread' && input.value === spread) {
      input.checked = true
    }
  })
}

function updateZoomDisplay (): void {
  // @ts-ignore
  const oniPdf = window.oniPdf as OniPDF
  const { zoom } = oniPdf.layout()
  
  // console.log(Math.round(zoom! * 100).toString())
}

(async () => {
  await initializePdfViewer()
  setupEventHandlers()
})()
