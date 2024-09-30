import { provider } from '../provider'
import { createLayout, type Layout, type LayoutOptions } from './layout/createLayout'
import { createLocate, type Locate, type LocateOptions } from './locate/createLocate'

export type Presentation = {
  layout: (options?: LayoutOptions) => Layout
  locate: (options?: LocateOptions) => Locate
}

export const createPresentation = () => provider((context) => {
  const layout = createLayout()
  const locate = createLocate()

  const rendition = {
    layout,
    locate
  }

  return rendition
})
