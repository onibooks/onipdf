export const warn = (
  message: string
) => {
  const style = 'font-weight: bold;'
  console.warn(`%c[OniPDF]:`, style, message)
}