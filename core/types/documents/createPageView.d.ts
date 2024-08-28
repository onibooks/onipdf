import { type GlobalContext } from '../provider';
export declare class PageView {
    static context: GlobalContext;
    index: number;
    rootNode: HTMLDivElement;
    isLoad: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    load(): Promise<this | undefined>;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
    renderToCanvas(): Promise<HTMLCanvasElement>;
    renderToImage(): Promise<HTMLImageElement>;
}
export declare const createPageView: (index: number) => PageView;
