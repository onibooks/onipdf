import type { GlobalContext } from '../provider';
export type Options = {
    type?: 'image' | 'canvas' | 'svg';
    page?: number;
};
export declare const render: (context: GlobalContext) => (element: HTMLElement, options?: Options) => Promise<void>;
