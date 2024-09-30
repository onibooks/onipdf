import { type Layout, type LayoutOptions } from './layout/createLayout';
export type Presentation = {
    layout: (options?: LayoutOptions) => Layout;
};
export declare const createPresentation: () => {
    layout: (options?: LayoutOptions) => Layout;
};
