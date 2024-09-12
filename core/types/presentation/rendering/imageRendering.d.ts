import type { GlobalContext } from '../../provider';
export declare const renderPageToImage: (context: GlobalContext) => (index?: number) => Promise<void>;
export declare const clearImage: () => () => void;
