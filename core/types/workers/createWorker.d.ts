import * as commands from './commands.js';
export type MuPDFWorker = Worker & {
    [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>;
};
export declare const createWorker: (muPDFSrc: string) => Promise<MuPDFWorker>;
