import { type GlobalContext } from '../provider';
export declare class PageView {
    static context: GlobalContext;
    index: number;
    zoom: number;
    pageSize: {
        width: number;
        height: number;
    };
    pageSection: HTMLDivElement;
    pageContainer: HTMLDivElement;
    isLoad: boolean;
    isRendered: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    setZoom(zoomPercentage: number): void;
    convertPercentageToDPI(scale?: number): number;
    getViewport(): {
        width: number;
        height: number;
    };
    init(): Promise<void>;
    getScaledSize(): {
        scaledWidth: number;
        scaledHeight: number;
    };
    getScale(): number;
    load(): Promise<this | undefined>;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
}
export declare const createPageView: (index: number) => Promise<PageView>;
