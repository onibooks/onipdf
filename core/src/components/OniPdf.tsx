import clsx from 'clsx'
import { useRef, useState, useEffect, useMemo } from 'preact/hooks'

import OniPage from './OniPage'

import type { Emotion } from '@emotion/css/types/create-instance'
import type { GlobalContext } from '../provider'

type OniPdfProps = {
  context: GlobalContext
}

const OniPdf = ({
  context
}: OniPdfProps) => {
  const { oniPDF, pageViews, options, scrollingElement } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const pageRefs = useRef<Array<HTMLDivElement | null>>(new Array(pageViews.length).fill(null))
  const scrollingRef = useRef<HTMLDivElement>(null)

  const [isShow, setIsShow] = useState(false)
  
  const onReady = async () => {
    const totalPages = await oniPDF.getTotalPages()
    
    if (totalPages === pageViews.length) {
      console.log('뼈대 완성')

      const page = options.page!
      await goToPage(page)
      const canvasNode = await oniPDF.renderToCanvas(page)
      pageRefs.current[page]?.appendChild(canvasNode)
    }
  }

  const goToPage = async (page: number) => {
    if (scrollingRef.current) {
      const pageSize = await pageViews[page].getPageSize()
      scrollingRef.current.scrollTop = page * Math.floor(pageSize.height)
      console.log(scrollingRef.current.scrollTop)
    }
  }

  useEffect(() => {
    if (scrollingRef.current) {
      context.scrollingElement = scrollingRef.current
    }

    onReady()
  }, [pageViews])

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)
  }, [])

  return (
    <div class={clsx('scrolling', classes.Scrolling)} ref={scrollingRef}>
      {pageViews &&
        <div class={clsx('pages')}>
          {context.pageViews.map((_, index) => 
            <OniPage 
              key={index}
              index={index}
              context={context}
              ref={(el: HTMLDivElement | null) => (pageRefs.current[index] = el)}
            />
          )}
        </div>
      }
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