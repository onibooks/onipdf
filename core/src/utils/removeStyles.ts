export const removeStyles = (element: HTMLElement | HTMLElement[]) => {
  if (Array.isArray(element)) {
    element.forEach(elem => removeStyles(elem))
    
    return
  }

  element.removeAttribute('style')
}
