export type Options = {
  muPDFSrc: string
}

export const createBook = async ({
  muPDFSrc
}: Options) => {
  const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module'})
  worker.postMessage({ type: 'init', muPDFSrc })
}