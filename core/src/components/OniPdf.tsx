import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'
import { debounce, addClass, removeClass } from '../utils'
import { useForceUpdate } from '../hooks/useForceUpdate'

import Single from './Spread/Single3'
import Double from './Spread/Double'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import type { Spread } from '../presentation/layout/createLayout'

type OniPDFProps = {
  context: GlobalContext
}

const debounceTimeoutDelay = 350

const OniPDF = ({
  context
}: OniPDFProps) => {
  const { presentation, options } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])

  const oniDocumentRef = useRef<HTMLDivElement>(null)
  const oniContainerRef = useRef<HTMLDivElement>(null)
  
  const [spread, setSpread] = useState<Spread>() // Spread 컴포넌트 변경을 위한 상태
  const isSingle = spread === 'single'
  const isDouble = spread === 'double' || spread === 'coverFacing'
  console.log('render onipdf')

  useEffect(() => {
    // DOM 준비
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current

      const { spread } = presentation.layout({
        ...options.layout
      })

      setSpread(spread!)
    }
  }, [])
  
  useEffect(() => {
    const { 
      oniPDF,
      sangte,
      presentation,
      rootElement,
      documentElement
    } = context

    const setResizeState = () => {
      sangte.setState({ isResize: true })
      addClass(documentElement, 'is-resize')
    }

    const unsetResizeState = () => {
      sangte.setState({ isResize: false })
      removeClass(documentElement, 'is-resize')
    }

    const handleResize = (event?: Event) => {
      const isForceLayout = event && (event as Event & { isForceLayout?: boolean }).isForceLayout 
      if (isForceLayout) {
        const { spread } = context.presentation.layout()
        setSpread(spread!)
      }

      const {
        rootWidth,
        rootHeight
      } = presentation.layout({
        width: rootElement.clientWidth,
        height: rootElement.clientHeight
      })
      
      const rootVariables = {
        rootWidth: `${rootWidth}px`,
        rootHeight: `${rootHeight}px`
      }
      
      setCssVariables(rootVariables, oniDocumentRef.current as HTMLElement)
      
      if (event) {
        setResizeState()
        oniPDF.emit(EVENTS.RESIZE, event)
      }
    }
    handleResize()

    const handleResized = debounce((event?: Event) => {
      if (event) {
        unsetResizeState()
        oniPDF.emit(EVENTS.RESIZED)
      }
    }, debounceTimeoutDelay)
    
    const handleReady = (event?: Event) => {
      sangte.setState({ isResize: false, isReady: true })
      const { divisor } = presentation.layout()
      const currentPage = options.locate?.currentPage || 0

      presentation.locate({
        ...options.locate,
        currentPage: currentPage / divisor
      })

      if (event) {
        oniPDF.emit(EVENTS.RENDER, event)
      }
    }

    const handleRender = (event?: Event) => {
      sangte.setState({
        isRendered: true
      })

      if (event) {
        oniPDF.emit(EVENTS.RENDERED, event)
      }
    }

    const handleArrowKey = (event?: Event) => {
      const eventType = (event as KeyboardEvent)
      if (eventType.key === 'ArrowDown' || eventType.key === 'ArrowRight') {
        goToNextPage()
      } else if (eventType.key === 'ArrowUp' || eventType.key === 'ArrowLeft') {
        goToPrevPage()
      }
    }

    const goToPrevPage = () => {
      const { currentPage } = presentation.locate()
      presentation.locate({
        currentPage: Math.max(currentPage! - 1, 0)
      })
    }

    const goToNextPage = () => {
      const { currentPage, totalPages } = presentation.locate()
      presentation.locate({
        currentPage: Math.min(currentPage! + 1, totalPages!)
      })
    }

    const handleScroll = (event?: Event) => {
      if (event) {
        sangte.setState({ isScroll: true })
        oniPDF.emit(EVENTS.SCROLL)
      }
    }
    
    const handleScrolled = debounce((event?: Event) => {
      if (event) {
        sangte.setState({ isScroll: false })
        oniPDF.emit(EVENTS.SCROLLED)
      }
    }, debounceTimeoutDelay)

    window.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResized)
    window.addEventListener(EVENTS.KEYDOWN, handleArrowKey)
    documentElement.addEventListener('scroll', handleScroll)
    documentElement.addEventListener('scroll', handleScrolled)

    oniPDF.once(EVENTS.READY, handleReady)
    oniPDF.on(EVENTS.RENDER, handleRender)
    return () => {
      window.removeEventListener(EVENTS.RESIZE, handleResize)
      window.removeEventListener(EVENTS.KEYDOWN, handleArrowKey)

      oniPDF.off(EVENTS.RENDER, handleRender)
      documentElement.removeEventListener(EVENTS.SCROLL, handleScroll)
    }
  }, [])

  return (
    <div
      class={clsx('oni-document', classes.OniDocument)}
      ref={oniDocumentRef}
    >
      <div
        className={clsx('oni-container', classes.OniContainer)}
        ref={oniContainerRef}
        >
        {isSingle && <Single context={context} />}
        {isDouble && <Double context={context} />}
      </div>
    </div>
  )
}

const createClasses = (
  css: Emotion['css'],
  options: Options
) => ({
  root: css`
    /* https://stackoverflow.com/questions/15751012/css-transform-causes-flicker-in-safari-but-only-when-the-browser-is-2000px-w#15759785 */
    backface-visibility: hidden;
    overflow-x: hidden;
    overflow-y: hidden;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    touch-action: pan-x pan-y;
    overscroll-behavior-y: contain;
  `,

  OniDocument: css`
    position: relative;
    outline: none;
    cursor: default;
    box-sizing: border-box;
    width: var(--root-width) !important;
    height: var(--root-height) !important;
    font-size: 0;

    &.scrolled {
      overflow: auto;
    }
    &.paginated {
      overflow: hidden;
    }
  `,

  OniContainer: css`
    position: relative;
    width: var(--total-width) !important;
  
    .scrolled & {
      margin: 0 auto;
    }
  `
})

export default OniPDF
