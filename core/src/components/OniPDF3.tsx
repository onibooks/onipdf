import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'
import { setCssVariables } from '../helpers'

import Single from './Spread/Single'
import Double from './Spread/Double'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'

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

  useEffect(() => {
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current

      const { spread } = context.presentation.layout({
        width: context.rootElement.clientWidth,
        height: context.rootElement.clientHeight,
        ...options.layout
      })
      
      // context.presentation.locate({
      //   ...options.locate
      // })

      setSpread(spread!)
    }
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
      
      setCssVariables(rootVariables, context.rootElement as HTMLElement)
      
      if (event) {
        oniPDF.emit(EVENTS.RESIZE, event)
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
        context.oniPDF.emit(EVENTS.SCROLL)
      }
    }

    const handleRender = () => {
      context.presentation.locate({
        ...options.locate
      })

      sangte.setState({
        isRendered: true
      })
    }

    window.addEventListener(EVENTS.KEYDOWN, handleArrowKey)
    window.addEventListener(EVENTS.RESIZE, handleResize)
    context.documentElement.addEventListener(EVENTS.SCROLL, handleScroll)
    context.oniPDF.on(EVENTS.RENDER, handleRender)
    return () => {
      window.removeEventListener(EVENTS.KEYDOWN, handleArrowKey)
      window.removeEventListener(EVENTS.RESIZE, handleResize)
      context.documentElement.removeEventListener(EVENTS.SCROLL, handleScroll)
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