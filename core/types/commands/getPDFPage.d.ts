import type { GlobalContext } from '../provider';
export declare const getPDFPage: (context: GlobalContext) => (index?: number) => Promise<{
    pageSize: {
        width: number;
        height: number;
    };
    pageText: any;
    pageLinks: any;
}>;
