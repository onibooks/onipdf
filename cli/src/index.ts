#!/usr/bin/env node

import { program } from 'commander'
import { embedMuPDF } from './commands/embedMuPDF'

program
  .command('embed-mupdf')
  .description('MuPDF.js의 빌드된 버전을 원하는 경로에 배포합니다. @onipdf/core 패키지에서 사용합니다.')
  .option('-p, --path <path>', '복사할 폴더의 경로를 지정해주세요')
  .action(async (options) => {
    try {
      await embedMuPDF(options)
      console.log('파일이 성공적으로 복사 되었습니다.')
    } catch (error) {
      console.error('파일 복사 중 오류가 발생했습니다:', error)
      process.exit(1)
    }
  })

program.parse(process.argv)