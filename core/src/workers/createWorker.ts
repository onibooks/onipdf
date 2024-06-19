export const createWorker = (muPDFSrc: string, muPDFId: number) => {
  const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' })
  worker.postMessage({ type: 'install', muPDFSrc })

  return worker
}