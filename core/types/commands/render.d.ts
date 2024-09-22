import type { GlobalContext } from '../provider';
import type { LayoutOptions } from '../rendition/layout/createLayout';
export type Options = {
    type?: 'image' | 'canvas' | 'svg';
    page?: number;
    zoom?: number;
    layout?: LayoutOptions;
};
export declare const render: (context: GlobalContext) => (element: HTMLElement, options?: Options) => Promise<void>;
