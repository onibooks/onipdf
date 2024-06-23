/// <reference types="node" />
import type { GlobalContext } from '../provider';
export declare const openDocument: (context: GlobalContext) => (buffer: Buffer | ArrayBuffer) => Promise<void>;
