import type * as MuPDF from 'mupdf'

let mupdf: typeof MuPDF

let uid = 0

const worker = self

const documents = new Map<number, MuPDF.Document>()

const commands = {
  install: async (muPDFSrc: string) => {
    if (!mupdf) {
      mupdf = await import(/* @vite-ignore */ muPDFSrc)
    }
  }
}

worker.onmessage = async (
  event: MessageEvent
) => {
  const { type, ...args } = event.data
  const command = commands[type]
  if (!command) {
    return
  }

  try {
    // command가 항상 async 함수인건 아니지만, 단순히 코드의 간결함을 위해 아래와 같이 처리합니다.
    await command(...Object.values(args))
  } catch (error) {
    console.error('worker command:', error)
  }
}