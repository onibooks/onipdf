const camelToVar = (
  camel: string
): string => (
  `--${camel.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`
)

export const setCssVariables = <T>(
  props: { [key:string]: T },
  root: HTMLElement
): void => {
  for (const [property, value] of Object.entries(props)) {
    root.style.setProperty(camelToVar(property), String(value))
  }
}