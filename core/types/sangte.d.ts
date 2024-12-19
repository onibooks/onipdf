export type Sangte = {
    isLoad: boolean;
    isResize: boolean;
    isScroll: boolean;
    isReady: boolean;
    isRendered: boolean;
    scale: number;
};
export declare const createSangte: () => import("zustand/vanilla").StoreApi<Sangte>;
