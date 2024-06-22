import type { WorkerContext } from './worker.js';
export declare const openDocument: (context: WorkerContext) => (buffer: Buffer, magic: string) => void;
export declare const closeDocument: (context: WorkerContext) => () => void;
