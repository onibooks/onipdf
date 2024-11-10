import clsx from 'clsx'
import { useState, useRef, useMemo, useEffect } from 'preact/hooks'
import { EVENTS } from '../constants'
import { debounce } from '../utils/debounce'
import { setCssVariables } from '../helpers'

import PageView from './PageView'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'
import type { Options } from '../commands/render'

type OniPDFProps = {
  context: GlobalContext
}

const OniPDF = ({
  context
}: OniPDFProps) => {
  const { oniPDF, pageViews, presentation, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css, options), [options])

  const oniDocumentRef = useRef<HTMLDivElement>(null)
  const oniBodyRef = useRef<HTMLDivElement>(null)

  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (oniDocumentRef.current) {
      context.documentElement = oniDocumentRef.current
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const totalPages = await oniPDF.getTotalPages()
      setTotalPages(totalPages)
    })()
  }, [])

  useEffect(() => {
    const { layout } = context.options
    
    presentation.layout({
      width: 0,
      height: 0,
      ...layout
    })
  }, [])
  
  useEffect(() => {
    const handleResize = (event?: Event) => {
      // context.rootElementSize = context.oniPDF.getRootElementSize()
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
      class={clsx('oni-document', classes.OniDocument)}
      ref={oniDocumentRef}
    >
      <div
        className={clsx('oni-container', classes.OniContainer)}
        // style={{
        //   width: `${visualListWidth}px`,
        //   height: `${visualListHeight}px`
        // }}
        // ref={visualListContainerRef}
      >
        <div
          className={clsx('oni-body', classes.OniBody)}
          ref={oniBodyRef}
        >
          {totalPages && 
            Array(totalPages).fill(null).map((_, pageIndex) => (
              <PageView
                context={context}
                pageIndex={pageIndex}
              />
            ))
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
    /* margin: auto; */
    outline: none;
    cursor: default;
    box-sizing: border-box;  
  `,

  OniContainer: css`
    position: relative;
    overflow: hidden;
    will-change: transform;
    width: 100%;
  `,

  OniBody: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: visible;
  `
})

export default OniPDF