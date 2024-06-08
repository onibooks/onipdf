import path from 'path'
import { defineConfig } from 'vite'
import { version } from './package.json'

import type { Plugin } from 'vite'

const relativeWorkerPathPlugin = (): Plugin => ({
  name: 'relative-worker-path',
  generateBundle(options, bundle) {
    for (const fileName in bundle) {
      const chunk = bundle[fileName]
      if (chunk.type === 'chunk') {
        chunk.code = chunk.code.replace(
          /\/assets\/onipdf-worker/g,
          `./assets/onipdf-worker`
        )
      }
    }
  }
})

export default defineConfig({
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'OniPDF',
      fileName: (format) => `onipdf-core.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          'onipdf': 'OniPDF'
        }
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
  worker: {
    format: 'es',
    rollupOptions: {
      external: ['mupdf'],
      output: {
        assetFileNames: `assets/onipdf-worker-${version}.js`,
        entryFileNames: `assets/onipdf-worker-${version}.js`,        
      }
    },
  },
  define: {
    __VERSION__: JSON.stringify(version),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  plugins: [
    relativeWorkerPathPlugin()
  ]
})