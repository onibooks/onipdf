import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

type Options = {
  path: string
}

export const embedMuPDF = async ({
  path: targetPath
}: Options) => {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const source = join(currentDir, '../node_modules/mupdf/dist')

  const files = await fs.promises.readdir(source)
  for (const file of files) {
    const srcPath = join(source, file)
    const destPath = join(targetPath, file)

    await fs.promises.copyFile(srcPath, destPath)
  }
}