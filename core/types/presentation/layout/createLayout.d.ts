export type LayoutOptions = {
    width?: number;
    height?: number;
    defaultPageWidth?: number;
    defaultPageHeight?: number;
    flow?: 'paginated' | 'scrolled';
    spread?: 'single' | 'double' | 'coverFacing';
    zoom?: number;
};
export type Layout = LayoutOptions & {
    divisor: number;
    rootWidth: number;
    rootHeight: number;
    pageWidth: number;
    pageHeight: number;
};
export declare const createLayout: () => (options?: LayoutOptions) => Layout;
