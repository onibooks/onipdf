import { createContext } from './provider'
import { createSangte } from './sangte'
import { createWorker } from './workers'
import { createCommands, type Commands } from './commands/createCommands'
import { warn } from './helpers'

export type Options = {
  muPDFSrc: string
}

export type BookInstance = Commands & {}

export const createObject = <T extends object, P extends object>(
  proto: T,
  props: P
) => (
  Object.create(proto, Object.getOwnPropertyDescriptors(props))
)

export const createBook = async ({
  muPDFSrc
}: Options) => {
  const context = createContext()
  context.sangte = createSangte()
  context.worker = await createWorker(muPDFSrc)

  const instance: BookInstance = (context.instance = createObject({
    /**
     * ※ 혼동 주의:
     * prototype 으로 들어가게 해놨지만, 일반적인 인스턴스와 달리 실제로 함수를 공유하지는 않음.
     * 단순, 고수준 API와 저수준 API를 나누기 위한 용도로 사용합니다.
     */
    ...createCommands()
  }, {
    version: __VERSION__,
    get worker () {
      return context.worker
    },
    set worker (v) {
      warn(`worker는 변경할 수 없습니다.`)
    }
  }))

  return instance
}