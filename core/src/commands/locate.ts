import type { GlobalContext } from '../provider';

export const locate = (context: GlobalContext) => () => {
  console.log('locate')
}