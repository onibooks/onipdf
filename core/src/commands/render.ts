import { EVENTS } from '../constants'
import type { GlobalContext } from '../provider'

export const render = (context: GlobalContext) => async (index = 0) => {
  console.log('RENDER PAGE', index + 1)

  await context.worker.loadPage(index)

  // const z = window.devicePixelRatio * 96 / 72
  // loadPage에 z를 넘겨주는 방식으로 가야할 수도 있음...
  const png = await context.worker.loadPage(index)

  context.oniPDF.emit(EVENTS.LOAD, { blobPng: png })
}
