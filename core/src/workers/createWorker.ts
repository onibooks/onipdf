export const createWorker = (muPDFSrc: string): Promise<Worker> => {
  return new Promise((resolve, rejected) => {
    const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
    const onMessage = (event) => {
      const { type, commands, uid } = event.data
      if (type === 'ready') {
        commands.forEach((command) => {
          worker[command] = (...args) => {
            return new Promise((resolve, rejected) => {
              worker.postMessage({
                type: command,
                uid,
                ...args
              })
            })
          }
        })
      }

      resolve(worker)
    }

    worker.addEventListener('message', onMessage)
    worker.postMessage({ type: 'ready', muPDFSrc })
  })
}