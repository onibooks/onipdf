import { type GlobalContext } from '../provider';
export declare class PageView {
    static context: GlobalContext;
    index: number;
    zoom: number;
    pageSize: {
        width: number;
        height: number;
    };
    rootNode: HTMLDivElement;
    canvasNode: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D | null;
    isLoad: boolean;
    isRendered: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    init(): Promise<void>;
    private updateSize;
    load(): Promise<this | undefined>;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
    renderToCanvas(): Promise<void>;
    renderToImage(): Promise<HTMLImageElement>;
}
export declare const createPageView: (index: number) => Promise<PageView>;
