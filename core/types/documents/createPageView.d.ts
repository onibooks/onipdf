import { type GlobalContext } from '../provider';
type PageSize = {
    width: number;
    height: number;
};
export declare class PageView {
    static context: GlobalContext;
    index: number;
    rootPageSize: PageSize;
    pageSize: PageSize;
    canvasSize: PageSize;
    scaledSize: PageSize;
    pageSection: HTMLElement;
    pageContainer: HTMLElement;
    canvas: ImageData;
    canvasNode: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D | null;
    isLoad: boolean;
    isRendered: boolean;
    currentScale: number;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    init(): Promise<void>;
    resizePage(): PageSize;
    updatePageSize(): Promise<void>;
    load(): Promise<this | undefined>;
    drawPageAsPixmap(): Promise<void>;
    restoreCanvasSize(): void;
    clearCanvasSize(): void;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
    private setSizeStyles;
    private createElement;
    private applyStyles;
}
export declare const createPageView: (index: number) => Promise<PageView>;
export {};
