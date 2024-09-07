;(() => {
  const open = document.querySelector('.open') as HTMLElement
  const close = document.querySelector('.close') as HTMLElement
  const resizer = document.querySelector('.resizer') as HTMLElement
  const sidebar = document.querySelector('.sidebar') as HTMLElement

  let clientX: number
  let width: number

  const onMouseDownHandler = (event: MouseEvent): void => {
    clientX = event.clientX

    const sidebarWidth = window.getComputedStyle(sidebar).width
    width = parseInt(sidebarWidth, 10)

    document.addEventListener('mousemove', onMouseMoveHandler)
    document.addEventListener('mouseup', onMouseUpHandler)
  }

  const onMouseMoveHandler = (event: MouseEvent): void => {
    const dx = event.clientX - clientX
    const completeWidth = width + dx
    
    if (completeWidth < 700) {
      sidebar.style.width = `${completeWidth}px`
    }
    
    if (completeWidth < 280) {
      sidebar.style.width = `0px`
    }
  }

  const onMouseUpHandler = (): void => {
    if (sidebar.style.width <= '0px') {
      open.style.zIndex = '10'
    }

    document.removeEventListener('mouseup', onMouseUpHandler)
    document.removeEventListener('mousemove', onMouseMoveHandler)
  }

  const onClickOpenHandler = (): void => {
    sidebar.style.width = '280px'
    open.style.zIndex = '0'
  }
  
  const onClickCloseHandler = (): void => {
    sidebar.style.width = '0'
    sidebar.style.overflow = 'hidden'

    sidebar.addEventListener('transitionend', () => {
      if (sidebar.style.width === '0px') {
        open.style.zIndex = '10'
      }
    }, { once: true }) 
  }

  open.addEventListener('click', onClickOpenHandler)
  close.addEventListener('click', onClickCloseHandler)
  resizer.addEventListener('mousedown', onMouseDownHandler)
})()
