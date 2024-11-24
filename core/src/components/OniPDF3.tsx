import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'

import Single from './Spread/Single'
import Double from './Spread/Double'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'
import PageView from './PageView'

type OniPDFProps = {
  context: GlobalContext
}

const OniPDF = ({
  context
}: OniPDFProps) => {
  const { oniPDF, presentation, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])

  const oniDocumentRef = useRef<HTMLDivElement>(null)
  const oniContainerRef = useRef<HTMLDivElement>(null)

  const [spread, setSpread] = useState('')

  const updateTotalSize = () => {
    const { pageHeight } = presentation.layout()
    const {
      flow,
      rootWidth,
      rootHeight,
      totalWidth,
      totalHeight
    } = presentation.layout({
      totalWidth: context.rootElement.clientWidth * context.totalPages,
      totalHeight: pageHeight! * context.totalPages
    })
      
    const totalVariables = {
      totalWidth: flow === 'paginated' ? `${totalWidth}px` : `${rootWidth}px`,
      totalHeight: flow === 'scrolled' ? `${totalHeight}px` : `${rootHeight}px`
    }

    setCssVariables(totalVariables, oniContainerRef.current as HTMLElement)  
  }

  useEffect(() => {
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current
    }
  }, [])

  useEffect(() => {
    const { spread } = presentation.layout({
      width: 0,
      height: 0,
      ...options.layout
    })

    presentation.locate({
      ...options.locate
    })
    
    setSpread(spread!)
  }, [])
  
  useEffect(() => {
    const handleResize = (event?: Event) => {
      const {
        rootWidth,
        rootHeight
      } = presentation.layout({
        width: context.rootElement.clientWidth,
        height: context.rootElement.clientHeight
      })
      
      const rootVariables = {
        rootWidth: `${rootWidth}px`,
        rootHeight: `${rootHeight}px`
      }
      
      updateTotalSize()
      
      setCssVariables(rootVariables, context.rootElement as HTMLElement)
      
      if (event) {
        oniPDF.emit(EVENTS.RESIZE, event)
      }
    }

    handleResize()

    const handleReady = () => {
      updateTotalSize()
    }

    const handleArrowKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        goToNextPage()
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
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
        currentPage: Math.min(currentPage! + 1, context.totalPages)
      })
    }

    const handleScroll = (event?: Event) => {
      if (event) {
        context.oniPDF.emit(EVENTS.SCROLL)
      }
    }

    window.addEventListener('keydown', handleArrowKey)
    window.addEventListener(EVENTS.RESIZE, handleResize)
    context.oniPDF.on(EVENTS.READY, handleReady)
    context.documentElement.addEventListener('scroll', handleScroll)
    // context.oniPDF.on(EVENTS.REFLOW, updateTotalSize)

    return () => {
      window.removeEventListener('keydown', handleArrowKey)
      window.removeEventListener(EVENTS.RESIZE, handleResize)
      context.oniPDF.off(EVENTS.READY, updateTotalSize)
      // context.oniPDF.off(EVENTS.REFLOW, updateTotalSize)
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
        {spread === 'single'
          ? (<Single context={context} />)
          : <Double context={context} />
        }
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
    outline: none;
    cursor: default;
    box-sizing: border-box;
    width:  var(--root-width) !important;
    height:  var(--root-height) !important;

    &.scrolled {
      overflow: auto;
    }
    &.paginated {
      overflow: hidden;
    }
  `,

  OniContainer: css`
    position: relative;
    /* overflow: hidden; */
    /* will-change: transform; */
    width: var(--total-width) !important;
    /* height: 100%; */
  
    .scrolled & {
      margin: 0 auto;
    }
  `
})

export default OniPDF