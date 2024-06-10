import { embedMuPDF } from './embedMuPDF'

export type Commands = {
  // 우선 any로 설정
  [key: string]: (options: any) => any
}

export const commands: Commands = {
  'embed-mupdf': embedMuPDF
}