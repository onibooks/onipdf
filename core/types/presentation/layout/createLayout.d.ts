export type LayoutOptions = {
    flow?: 'paginated' | 'scrolled';
    spread?: 'single' | 'double' | 'coverFacing';
    zoom?: number;
};
export type Layout = LayoutOptions & {
    divisor: number;
};
export declare const createLayout: () => (options?: LayoutOptions) => Layout;
