import type { WorkerContext } from '../worker.js';
export declare const getPageSize: (context: WorkerContext) => (index: number) => {
    width: number;
    height: number;
};
