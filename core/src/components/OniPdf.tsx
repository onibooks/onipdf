import clsx from 'clsx'
import { useRef, useState, useEffect, useMemo } from 'preact/hooks'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { options } = context
  const [currentPage, setCurrentPage] = useState<number>(0)
  const spineRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const classes = useMemo(() => createClasses(context.emotion.css), [])

  useEffect(() => {
    const renderContent = async () => {
      let renderedElement

      switch (options.type) {
        case 'image':
          renderedElement = await context.oniPDF.renderToImage()
          break
        case 'svg':
          renderedElement = await context.oniPDF.renderToSvg()
          break
        default:
          renderedElement = await context.oniPDF.renderToCanvas()
          break
      }

      if (pageRef.current && renderedElement) {
        pageRef.current.innerHTML = ''
        pageRef.current.appendChild(renderedElement)
      }
    }

    renderContent()
  }, [options.type, context.oniPDF])

  return (
    <div class={clsx(classes.Scrolling)}>
      <div 
        class={clsx(classes.Spine)}
        ref={spineRef}
      >
        <div ref={pageRef}></div>
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
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  `,
  
  Spine: css``
})

export default OniPdf