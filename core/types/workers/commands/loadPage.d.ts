import type { WorkerContext } from '../worker.js';
export declare const loadPage: (context: WorkerContext) => (index?: number) => {
    page: any;
    size: {
        width: number;
        height: number;
    };
    textData: any;
    linkData: any;
};
