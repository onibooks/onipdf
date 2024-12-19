export type Flow = 'paginated' | 'scrolled';
export type Spread = 'single' | 'double' | 'coverFacing';
export type LayoutOptions = {
    width?: number;
    height?: number;
    flow?: Flow;
    spread?: Spread;
    zoom?: number;
};
export type Layout = LayoutOptions & {
    divisor: number;
    rootWidth: number;
    rootHeight: number;
};
export declare const createLayout: () => (options?: LayoutOptions) => Layout;
