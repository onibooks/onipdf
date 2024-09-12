import type { GlobalContext } from '../provider';
export declare const openDocument: (context: GlobalContext) => (buffer: Buffer | ArrayBuffer) => Promise<MuPDF.Document>;
