import type { GlobalContext } from '../../provider';
export declare const renderPageToSVG: (context: GlobalContext) => (index?: number) => Promise<void>;
export declare const clearSVG: () => () => void;
