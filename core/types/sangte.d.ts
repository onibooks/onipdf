export type Sangte = {
    isLoad: boolean;
    isResize: boolean;
    isRendered: boolean;
    scale: number;
};
export declare const createSangte: () => import("zustand/vanilla").StoreApi<Sangte>;
