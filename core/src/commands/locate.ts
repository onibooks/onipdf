import type { GlobalContext } from '../provider';
import type { LocateOptions } from '../presentation/locate/createLocate'

export const locate = (context: GlobalContext) => (options?: LocateOptions) => {
  const { presentation } = context

  return presentation.locate(options)
}
