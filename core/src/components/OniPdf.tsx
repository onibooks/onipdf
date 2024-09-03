import clsx from 'clsx'
import { useRef, useEffect, useMemo, useState } from 'preact/hooks'

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

  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastScrollY = useRef<number>(0)
  const scrollTimeout = useRef<number | null>(null)
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set())

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
    if (scrollingRef.current) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(async (entry) => {
          const target = entry.target as HTMLElement
          const index = Number(target.dataset.index)
          const page = pageViews[index]

          if (entry.isIntersecting && !renderedPages.has(index)) {
            if (!page.isRendered) {
              console.log('render', index)
              await page.renderToCanvas()
              setRenderedPages(prev => new Set(prev).add(index))
            }
          }
        })
      },{
        root: scrollingRef.current,
        rootMargin: '300%'
      })

      observerRef.current = observer

      const observeElements = () => {
        for (const page of pageViews) {
          observerRef.current?.observe(page.rootNode)
        }
      }

      const handleScroll = () => {
        if (!scrollingRef.current) return

        const currentScrollY = scrollingRef.current.scrollTop
        const delta = Math.abs(currentScrollY - lastScrollY.current)

        // 스크롤 속도가 빠르면 observer를 일시 해제
        if (delta > 400 && observerRef.current) {
          console.log('스크롤 빠름', delta)
          observerRef.current.disconnect()
        }

        // 현재 스크롤 위치 업데이트
        lastScrollY.current = currentScrollY

        // 스크롤 멈추면 observer 다시 활성화
        clearTimeout(scrollTimeout.current as number)
        scrollTimeout.current = window.setTimeout(() => {
          if (scrollingRef.current && observerRef.current) {
             // 기존 observer를 disconnect 후 재설정
            observerRef.current.disconnect()
            observeElements()
          }
        }, 150)
      }

      if (scrollingRef.current) {
        scrollingRef.current.addEventListener('scroll', handleScroll)
      }

      observeElements()

      return () => {
        if (scrollingRef.current) {
          scrollingRef.current.removeEventListener('scroll', handleScroll)
        }
        observerRef.current?.disconnect()
      }
    }
  }, [scrollingRef]) // pageViews, renderedPages


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