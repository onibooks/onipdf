export type LayoutOptions = {
    width?: number;
    height?: number;
    flow?: 'paginated' | 'scrolled';
    spread?: 'single' | 'double' | 'coverFacing';
};
export type Layout = LayoutOptions & {
    divisor: number;
    pageWidth: number;
    pageHeight: number;
    contentWidth: number;
    contentHeight: number;
};
export declare const createLayout: () => (options?: LayoutOptions) => Layout;
