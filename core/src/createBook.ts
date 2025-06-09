import { createContext } from './provider'
import { createSangte } from './sangte'
import { createWorker } from './workers'
import { createEvents, type Events } from './events'
import { createCommands, type Commands } from './commands/createCommands'
import { warn } from './lib/warn'

export type Options = {  
  muPDFSrc: string
}

export type OniPDF = Commands & Events & {}

export const createObject = <T extends object, P extends object>(
  proto: T,
  props: P
) => (
  Object.create(proto, Object.getOwnPropertyDescriptors(props))
)

export const createBook = async (
  url: string, 
  options: Options
): Promise<OniPDF> => {
  const context = createContext()
  context.sangte = createSangte()
  context.worker = await createWorker(options.muPDFSrc)
  
  const oniPDF: OniPDF = (context.oniPDF = createObject({
   ...createCommands(),
   ...createEvents()
  }, {
    // version: __VERSION__,
    get worker () {
      return context.worker
    },
    set worker (v) {
      warn(`worker는 변경할 수 없습니다.`)
    },
    get mupdf () {
      return options.muPDFSrc
    }
  }))

  return oniPDF
}