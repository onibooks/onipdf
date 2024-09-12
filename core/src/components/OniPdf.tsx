import clsx from 'clsx'
import { useRef, useMemo, useEffect } from 'preact/hooks'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, pageViews, options } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const documentRef = useRef<HTMLDivElement>(null)
  const docuementWidthRef = useRef<number>(0)

  useEffect(() => {
    if (documentRef.current) {
      context.documentElement = documentRef.current
    }
  }, [])

  return (
    <div class={clsx('document', classes.Document)}>
      <div className="visual-container" style={{height: '177px', width: '300px', backgroundColor: 'blue'}}>
        <div className="visual-list-body">
          {/* <div className="pageSection">
            <canvas />
          </div> */}
        </div>
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

  Document: css`
    margin: auto;
    outline: none;
    cursor: default;
    box-sizing: border-box;
  `
})

export default OniPdf