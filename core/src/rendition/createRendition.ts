import { provider } from '../provider'
import { createLayout, type Layout, type LayoutOptions } from './layout/createLayout'
import { createLocate, type Locate, type LocateOptions } from './locate/createLocate'

export type Rendition = {
  layout: (options?: LayoutOptions) => Layout
  locate: (options?: LocateOptions) => Locate
}

export const createRendition = () => provider((context) => {
  const layout = createLayout()
  const locate = createLocate()

  // const rendition: Rendition = {
    // layout,
    // locate
  // }

  // return rendition
})