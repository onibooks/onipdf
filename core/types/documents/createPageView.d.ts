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
    scaledSize: PageSize;
    pageSection: HTMLDivElement;
    pageContainer: HTMLDivElement;
    isLoad: boolean;
    constructor(index: number);
    get context(): GlobalContext;
    get pageNumber(): number;
    init(): Promise<void>;
    load(): Promise<this | undefined>;
    getPageSize(): Promise<{
        width: number;
        height: number;
    }>;
    private setSizeStyles;
    private createDivElement;
    private applyStyles;
}
export declare const createPageView: (index: number) => Promise<PageView>;
export {};
