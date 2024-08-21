import { type GlobalContext } from '../provider';
export declare class PageView {
    static context: GlobalContext;
    index: number;
    isLoad: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    load(): Promise<this | undefined>;
    size(index: number): Promise<{
        width: number;
        height: number;
    }>;
    renderToCanvas(): Promise<HTMLCanvasElement>;
    renderToImage(): Promise<HTMLImageElement>;
}
export declare const createPageView: (index: number) => PageView;
