# OniPDF

OniPDF는 웹 브라우저에서 PDF 파일을 처리하고 렌더링할 수 있게 해주는 [MuPDF](https://github.com/ArtifexSoftware/mupdf.js)의 래퍼 라이브러리 입니다.  

## 설치하기
```bash
pnpm add @onipdf/core
```

## MuPDF 가져오기

OniPDF를 사용하기 위해서는 [MuPDF](https://github.com/ArtifexSoftware/mupdf.js)의 빌드된 스태틱 파일이 필요합니다. 빠른 시작을 위해 ```@onipdf/cli``` 패키지를 사용할 수 있습니다.
```bash
npx @onipdf/cli embed-mupdf -p <path>
```

## 실행하기
```ts
import { createBook } from '@onipdf/core'

const oniPDF = createBook({
  // MuPDF의 빌드된 파일이 저장된 경로를 지정하세요.
  muPDFSrc: 'path/to/your/mupdf.js'
})
```