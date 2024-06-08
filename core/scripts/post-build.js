import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 현재 파일의 디렉토리를 가져옴
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const mainFile = path.resolve(distDir, 'onipdf-core.es.js');

// Read the main output file
let content = fs.readFileSync(mainFile, 'utf-8');

// Modify the content to replace absolute URLs with relative ones
content = content.replace(/new Worker\(new URL\("\/assets/g, 'new Worker(new URL("./assets');

// Write the modified content back to the file
fs.writeFileSync(mainFile, content, 'utf-8');

console.log('Post-build processing complete.');