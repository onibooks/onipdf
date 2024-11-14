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
  const { oniPDF, presentation, options } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])

  const oniDocumentRef = useRef<HTMLDivElement>(null)
  const oniBodyRef = useRef<HTMLDivElement>(null)

  const [flow, setFlow] = useState('scrolled')
  const [spread, setSpread] = useState('single')

  const setTotalSize = () => {
    const { rootWidth, rootHeight } = presentation.layout()

    const variables = {
      totalWidth: `${rootWidth * context.totalPages}px`,
      totalHeight: `${rootHeight * context.totalPages}px`,
    }

    setCssVariables(variables, oniDocumentRef.current as HTMLElement)
  }

  useEffect(() => {
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current
    }
  }, [])

  useEffect(() => {
    const { layout } = context.options
    
    const { flow, spread } = presentation.layout({
      width: 0,
      height: 0,
      ...layout
    })

    setFlow(flow!)
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

      const variables = {
        rootWidth: `${rootWidth}px`,
        rootHeight: `${rootHeight}px`,
      }

      setCssVariables(variables, context.rootElement)
      setTotalSize()
      
      if (event) {
        oniPDF.emit(EVENTS.RESIZE, event)
      }
    }

    handleResize()

    window.addEventListener(EVENTS.RESIZE, handleResize)
    return () => {
      window.removeEventListener(EVENTS.RESIZE, handleResize)
    }
  }, [])

  return (
    <div
      class={clsx('oni-document', classes.OniDocument, flow)}
      ref={oniDocumentRef}
    >
      <div
        className={clsx('oni-container', classes.OniContainer)}
      >
        <div
          className={clsx('oni-body', classes.OniBody)}
          ref={oniBodyRef}
        >
          {spread === 'single'
            ? <Single context={context} />
            : <Double context={context} />
          }
        </div>
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
    width: 100%;
  
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