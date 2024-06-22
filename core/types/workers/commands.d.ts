import type { WorkerContext } from './worker.js';
export declare const openDocument: (context: WorkerContext) => (buffer: Buffer | ArrayBuffer, magic?: string) => void;
export declare const closeDocument: (context: WorkerContext) => () => void;
export declare const getMetaData: (context: WorkerContext) => () => any;
