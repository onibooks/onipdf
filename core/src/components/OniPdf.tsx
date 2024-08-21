import clsx from 'clsx'
import { useRef, useState, useEffect, useMemo } from 'preact/hooks'
import { EVENTS } from '../constants'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, options, sangte } = context
  const [isRendered, setIsRendered] = useState<boolean>(false)
  const spineRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const [pageSize, setPageSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    const renderContent = async () => {
      let renderedElement

      switch (options.type) {
        case 'image':
          renderedElement = await oniPDF.renderToImage()
          break
        default:
          renderedElement = await oniPDF.renderToCanvas(0)
          break
      }

      if (pageRef.current && renderedElement) {
        pageRef.current.innerHTML = ''
        pageRef.current.appendChild(renderedElement)
      }
    }

    renderContent()
  }, [options.type, oniPDF])

  useEffect(() => {
    oniPDF.on(EVENTS.RENDERED, (data: HTMLImageElement | HTMLCanvasElement) => {
      setIsRendered(true)
  
      if (data instanceof HTMLImageElement) {
        console.log("Image element:", data)
      } else if (data instanceof HTMLCanvasElement) {
        console.log("Canvas element:", data)
      }
    })
  }, [])

  useEffect(() => {
    if (isRendered) {
      const updateSizes = async () => {
        const { width, height } = await oniPDF.updateSize(options.page)

        setPageSize({
          width,
          height
        })
      }
  
      updateSizes()
    }
  }, [isRendered])

  return (
    <div class={clsx('scrolling', classes.Scrolling)}>
      <div 
        class={clsx('spine', classes.Spine)}
        ref={spineRef}
      >
        {isRendered && 
          <div
            class={clsx('page')}
            style={{
              width:`${pageSize?.width}px`, 
              height:`${pageSize?.height}px`
            }}
            ref={pageRef}
          >
          </div>
        }
      </div>
    </div>
  )
}

const createClasses = (
  css: Emotion['css']
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

  Scrolling: css`
    position: relative;
  `,
  
  Spine: css``,

  Page: css``
})

export default OniPdf