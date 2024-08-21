import type { GlobalContext } from '../provider';
export declare const updateSize: (context: GlobalContext) => (index?: number) => Promise<{
    width: number;
    height: number;
}>;
