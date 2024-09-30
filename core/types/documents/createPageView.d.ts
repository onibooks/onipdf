import { type GlobalContext } from '../provider';
type PageSize = {
    width: number;
    height: number;
};
export declare class PageView {
    static context: GlobalContext;
    index: number;
    zoom: number;
    pageSize: PageSize;
    pageSection: HTMLDivElement;
    pageContainer: HTMLDivElement;
    isLoad: boolean;
    isRendered: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    setZoom(zoomPercentage: number): void;
    convertPercentageToDPI(scale?: number): number;
    getViewport(): PageSize;
    init(): Promise<void>;
    getScaledSize(): PageSize;
    getScale(): number;
    load(): Promise<this | undefined>;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
}
export declare const createPageView: (index: number) => Promise<PageView>;
export {};
