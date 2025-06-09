export const addClass = (element: Element | Element[], value: string) => {
  if ('length' in element) {
    Array.from(element).forEach(
      elem => addClass(elem, value)
    )

    return
  }

  element.classList.add(value)
}

export const addStyles = (
  element: HTMLElement | HTMLElement[],
  styles: Partial<CSSStyleDeclaration>
) => {
  if (Array.isArray(element)) {
    element.forEach(
      elem => addStyles(elem, styles)
    )
    return
  }

  Object.assign(element.style, styles)
}


export const removeClass = (element: Element | Element[], value: string) => {
  if ('length' in element) {
    Array.from(element).forEach(
      elem => removeClass(elem, value)
    )

    return
  }

  element.classList.remove(value)
}

// From: GPT-4o
export const throttle = <T extends (...args: any[]) => void>(fn: T, wait: number): ((...args: Parameters<T>) => void) => {
  let isThrottling = false

  return (...args: Parameters<T>) => {
    if (!isThrottling) {
      fn(...args)
      isThrottling = true
      setTimeout(() => {
        isThrottling = false
      }, wait)
    }
  }
}