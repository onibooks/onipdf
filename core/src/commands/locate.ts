import type { GlobalContext } from '../provider';
import type { LocateOptions } from '../rendition/locate/createLocate'

export const locate = (context: GlobalContext) => (options?: LocateOptions) => {
  const { rendition } = context

  return rendition.locate(options)
}