import type { GlobalContext } from '../provider';

export const layout = (context: GlobalContext) => () => {
  console.log('layout')
}