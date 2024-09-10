export type LocateOptions = {
    currentPage?: number;
};
export type Locate = Required<LocateOptions> & {
    totalPages: number;
    chapterIndex: number;
    chapterTitle: string;
};
export declare const createLocate: () => void;
