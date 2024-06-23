import * as commands from './commands/index.js';
export type MuPDFWorker = Worker & {
    [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>;
};
export declare const createWorker: (muPDFSrc: string) => Promise<MuPDFWorker>;
