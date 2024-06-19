import * as commands from './commands.js'

import type * as MuPDF from 'mupdf'

let mupdf: typeof MuPDF

const onInstall = async (event: MessageEvent) => {
  if (mupdf) {
    return
  }

  const { muPDFSrc } = event.data
  try {
    mupdf = await commands.install(muPDFSrc)
  } catch (error) {
    console.error('worker install:', error)
  }
}

const onCommands = async (event: MessageEvent) => {
  const { type, ...args } = event.data
  const command = commands[type]
  if (!command) {
    return
  }

  try {
    command(...Object.values(args))
  } catch (error) {
    console.error('worker command:', error)
  }
}

const onMessage = async (event: MessageEvent) => {
  const { type } = event.data
  switch (type) {
    case 'install':
      onInstall(event)
      break
    default:
      onCommands(event)
  }
}

self.addEventListener('message', onMessage)