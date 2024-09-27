export type Sangte = {
    isLoad: boolean;
    currentIndex: number;
    cachedScale: number | null;
    cachedRootRect: DOMRect | null;
};
export declare const createSangte: () => import("zustand/vanilla").StoreApi<Sangte>;
