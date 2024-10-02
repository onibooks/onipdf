import { type Layout, type LayoutOptions } from './layout/createLayout';
import { type Locate, type LocateOptions } from './locate/createLocate';
export type Presentation = {
    layout: (options?: LayoutOptions) => Layout;
    locate: (options?: LocateOptions) => Locate;
};
export declare const createPresentation: () => {
    layout: (options?: LayoutOptions) => Layout;
    locate: (options?: LocateOptions) => Locate;
};
