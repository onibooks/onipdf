export const install = async (muPDFSrc: string) => (
  await import(/* @vite-ignore */ muPDFSrc)
)