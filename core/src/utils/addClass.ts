export const addClass = (element: Element | Element[], value: string) => {
  if ('length' in element) {
    Array.from(element).forEach(
      elem => addClass(elem, value)
    )

    return
  }

  element.classList.add(value)
}