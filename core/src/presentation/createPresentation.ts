import { provider } from '../provider'
import { createLayout, type Layout, type LayoutOptions } from './layout/createLayout'

export type Presentation = {
  layout: (options?: LayoutOptions) => Layout
}

export const createPresentation = () => provider((context) => {
  const layout = createLayout()

  const rendition = {
    layout
  }

  return rendition
})