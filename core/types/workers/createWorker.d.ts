import * as commands from './commands.js';
type ExtendedWorker = Worker & {
    [Key in keyof typeof commands]?: ReturnType<typeof commands[Key]>;
};
export declare const createWorker: (muPDFSrc: string) => Promise<ExtendedWorker>;
export {};
