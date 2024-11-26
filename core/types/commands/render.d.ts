import type { GlobalContext } from '../provider';
import type { LayoutOptions } from '../presentation/layout/createLayout';
import type { LocateOptions } from '../presentation/locate/createLocate';
export type Options = {
    zoom?: number;
    layout?: LayoutOptions;
    locate?: LocateOptions;
};
export declare const render: (context: GlobalContext) => (element: HTMLElement, options?: Options) => Promise<void>;
