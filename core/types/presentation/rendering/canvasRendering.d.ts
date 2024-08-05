import type { GlobalContext } from '../../provider';
export declare const renderPageToCanvas: (context: GlobalContext) => (index?: number) => Promise<void>;
export declare const clearCanvas: () => () => void;
