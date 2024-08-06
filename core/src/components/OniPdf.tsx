import clsx from 'clsx'
import { useRef, useState, useMemo } from 'preact/hooks'

import type { GlobalContext } from '../provider'
import type { Emotion } from '@emotion/css/types/create-instance'
import { useEffect } from 'react'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { options } = context
  const [currentPage, setCurrentPage] = useState<number>(0)

  useEffect(() => {
    setCurrentPage(options.page!)

    switch (options.type) {
      case 'image' :
        context.oniPDF.renderToImage()
        break
      case 'svg' :
        context.oniPDF.renderToSvg()
        break
      default :
        context.oniPDF.renderToCanvas()
        break
    }
  }, [options])
  
  const spineRef = useRef<HTMLDivElement>(null)
  
  const classes = useMemo(() => 
    createClasses(context.emotion.css),
  [])

  return (
    <div class={clsx(classes.Scrolling)}>
      <div 
        class={clsx(classes.Spine)}
        ref={spineRef}
      >
        spineRef
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