export type LocateOptions = {
    currentPage?: number;
};
export type Locate = LocateOptions & {
    totalPages: number;
    chapterIndex: number;
    chapterTitle: string;
};
export declare const createLocate: () => (options?: LocateOptions) => Locate;
