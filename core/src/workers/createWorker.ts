export const createWorker = () => (
  new Worker(new URL('./worker', import.meta.url), { type: 'module' })
)