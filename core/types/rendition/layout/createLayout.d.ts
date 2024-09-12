export type LayoutOptions = {
    width?: number;
    height?: number;
};
export type Layout = LayoutOptions & {
    name: string;
    divisor: number;
    pageWidth: number;
    pageHeight: number;
    contentWidth: number;
    contentHeight: number;
};
export declare const createLayout: () => void;
