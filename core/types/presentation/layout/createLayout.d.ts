export type LayoutOptions = {
    width?: number;
    height?: number;
    flow?: 'paginated' | 'scrolled';
    spread?: 'single' | 'double' | 'coverFacing';
    zoom?: number;
};
export type Layout = LayoutOptions & {
    divisor: number;
    rootWidth: number;
    rootHeight: number;
};
export declare const createLayout: () => (options?: LayoutOptions) => Layout;
