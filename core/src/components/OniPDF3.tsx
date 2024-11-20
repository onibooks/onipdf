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

  const updateTotalSize = () => {
    if (context.totalHeights) {
      const {
        flow,
        rootWidth,
        rootHeight,
        totalWidth,
        totalHeight
      } = presentation.layout({
        totalWidth: context.rootElement.clientWidth * context.totalPages,
        totalHeight: context.totalHeights
      })
        
      const totalVariables = {
        totalWidth: flow === 'paginated' ? `${totalWidth}px` : `${rootWidth}px`,
        totalHeight: flow === 'scrolled' ? `${totalHeight}px` : `${rootHeight}px`
      }

      setCssVariables(totalVariables, oniContainerRef.current as HTMLElement)  
    }
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
      
      setCssVariables(rootVariables, context.rootElement as HTMLElement)
      
      if (event) {
        oniPDF.emit(EVENTS.RESIZE, event)
      }
    }
    
    const handleReady = () => {
      updateTotalSize()
    }

    handleResize()

    window.addEventListener(EVENTS.RESIZE, handleResize)
    context.oniPDF.on(EVENTS.READY, handleReady)
    return () => {
      window.removeEventListener(EVENTS.RESIZE, handleResize)
      context.oniPDF.off(EVENTS.READY, handleReady)
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

    &.scrolled {
      width: 100%;
      overflow: auto;
    }
    &.paginated {
      overflow: hidden;
    }
  `,

  OniContainer: css`
    position: relative;
    overflow: hidden;
    will-change: transform;
    width: var(--total-width) !important;
    height: var(--total-height) !important;
  
    .scrolled & {
      margin: 0 auto;
    }
  `,

  OniBody: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: visible;

    .paginated & {
      display : flex;
    }
  `
})

export default OniPDF