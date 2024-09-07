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
  const { oniPDF, pageViews, options, sangte } = context
  const classes = useMemo(() => createClasses(context.emotion.css), [])
  const pageRefs = useRef<HTMLDivElement>(null)
  const scrollingRef = useRef<HTMLDivElement>(null)
  const isRendering = useRef(true)
  const lastPos = useRef<number>(0)
  const lastTime = useRef(performance.now())
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  const onScroll = async () => {
    const currentIndex = updateCurrentIndex()
    sangte.setState({ currentIndex })
  }
  
  const setupObserver = () => {
    if (scrollingRef.current) {
      const io = new IntersectionObserver((entries, index) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          const index = Number(target.dataset.index)
          const page = pageViews[index]

          if (entry.isIntersecting && isRendering.current) {
            if (!page.isRendered) {
              console.log('render: ', index)
              page.renderToCanvas()
            }
          }
        })
      }, {
        root: scrollingRef.current,
        rootMargin: '20%'
      })

      pageViews.forEach((page) => io.observe(page.rootNode))
      
      observerRef.current = io
    }
  }

  const destroyObserver = () => {
    if (observerRef.current) {
      pageViews.forEach((page) => observerRef.current?.unobserve(page.rootNode))

      observerRef.current.disconnect()
      observerRef.current = null
    }
  }

  const updateCurrentIndex = () => {
    if (!scrollingRef.current || pageViews.length === 0) {
      return 0
    }

    const { scrollTop, clientHeight } = scrollingRef.current
    let currentIndex = 0

    pageViews.forEach((page, index) => {
      const pageElement = page.rootNode
      const { offsetTop: pageTop, offsetHeight: pageHeight } = pageElement

      // 페이지가 30% 이상 보이는지 체크
      const visibleHeight = Math.min(pageHeight, clientHeight + scrollTop - pageTop)
      const visibilityRatio = visibleHeight / pageHeight

      // 30% 이상 보이면 currentIndex 업데이트
      if (visibilityRatio >= 0.3 && visibilityRatio <= 1) {
        currentIndex = index
      }
    })

    return currentIndex
  }

  useEffect(() => {
    if (!scrollingRef.current) return

    const updateSpeed = async () => {
      const currentPos = scrollingRef.current?.scrollTop!
      const currentTime = performance.now()
      const deltaPos = currentPos - lastPos.current
      const deltaTime = currentTime - lastTime.current
      const currentSpeed = deltaPos / deltaTime

      if (currentSpeed > 12) {
        if (isRendering.current) {
          // 렌더링 중단
          isRendering.current = false
        }
      } else {
        if (!isRendering.current) {
          if (currentSpeed < 0.1) {
            const { currentIndex } = sangte.getState()
            await oniPDF.renderToCanvas(currentIndex)
            console.log('재개 렌더링', currentIndex)
            
            // 렌더링 재개
            isRendering.current = true
            setupObserver()
          }
        }
      }

      lastPos.current = currentPos
      lastTime.current = currentTime

      requestAnimationFrame(updateSpeed)
    }

    const animationId = requestAnimationFrame(updateSpeed)

    return () => cancelAnimationFrame(animationId)
  }, [])

  useEffect(() => {
    if (scrollingRef.current) {
      context.scrollingElement = scrollingRef.current
    }

    onReady()
    
    scrollingRef.current?.addEventListener('scroll', onScroll)
    
    setupObserver()

    return () => {
      scrollingRef.current?.removeEventListener('scroll', onScroll)
      
      destroyObserver()
    }
  }, [])

  useEffect(() => {
    const rootElement = document.documentElement
    rootElement.classList.add(classes.root)

    for (const page of context.pageViews) {
      pageRefs.current?.appendChild(page.rootNode)
    }
  }, [])

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