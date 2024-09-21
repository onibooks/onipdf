export const removeClass = (element: Element | Element[], value: string) => {
  if ('length' in element) {
    Array.from(element).forEach(
      elem => removeClass(elem, value)
    )

    return
  }

  element.classList.remove(value)
}