import { type Layout, type LayoutOptions } from './layout/createLayout';
import { type Locate, type LocateOptions } from './locate/createLocate';
export type Rendition = {
    layout: (options?: LayoutOptions) => Layout;
    locate: (options?: LocateOptions) => Locate;
};
export declare const createRendition: () => void;
