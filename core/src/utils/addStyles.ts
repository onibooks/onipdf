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
