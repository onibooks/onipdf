import type { WorkerContext } from '../worker.js';
export declare const loadPage: (context: WorkerContext) => (devicePixelRatio: any, index?: number) => {
    page: any;
    pageSize: {
        width: number;
        height: number;
    };
    pageText: any;
    pageLinks: any;
    pixmap: any;
};
