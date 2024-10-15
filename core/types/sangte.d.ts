import { PageView } from './documents/createPageView';
export type Sangte = {
    isLoad: boolean;
    currentIndex: number;
    scale: number;
    pageViewSections: PageView[];
};
export declare const createSangte: () => import("zustand/vanilla").StoreApi<Sangte>;
