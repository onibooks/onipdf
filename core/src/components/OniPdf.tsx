import clsx from 'clsx'
import { useRef, useEffect, useMemo } from 'preact/hooks'

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
  const pageRefs = useRef<HTMLDivElement>(null)
  const scrollingRef = useRef<HTMLDivElement>(null)

  const onReady = async () => {
    const totalPages = await oniPDF.getTotalPages()
    
    if (totalPages === pageViews.length) {
      console.log('뼈대 완성')

      switch (options.type) {
        case 'image' :
          await oniPDF.renderToImage(options.page)
        break

        default :
          await oniPDF.renderToCanvas(options.page)
      }
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

    for (const page of context.pageViews) {
      pageRefs.current?.appendChild(page.rootNode)
    }
  }, [])

  useEffect(() => {
    if (pageRefs.current) {
      const io = new IntersectionObserver(([entry], observer) => {
        const target = entry.target as HTMLElement
        const index = Number(target.dataset.index)
        const page = pageViews[index]

        if (!entry.isIntersecting) {
          console.log('returning')
          return
        }

        if (!page.isRendered) {
          page.renderToCanvas()
        }

      }, {
        root: context.scrollingElement,
        rootMargin: '40%'
      })

      for (let page of pageViews) {
        io.observe(page.rootNode)
      }
    }
  }, [pageRefs])

  return (
    <div class={clsx('scrolling', classes.Scrolling)} ref={scrollingRef}>
      {pageViews && <div class={clsx('pages')} ref={pageRefs} />}
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
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
  `,
  
  Spine: css``,

  Page: css``
})

export default OniPdf