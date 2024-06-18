let uid = 0

export const createWorker = (muPDFSrc: string) => {
  const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
  worker.postMessage({ type: 'install', muPDFSrc })

  return worker
}