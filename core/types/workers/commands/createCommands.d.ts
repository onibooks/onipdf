import * as commands from './index.js';
import type { WorkerContext } from '../worker.js';
export type Commands = {
    [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>;
};
export declare const createCommands: (context: WorkerContext) => {};
