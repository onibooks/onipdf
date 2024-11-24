export type LocateOptions = {
    currentPage?: number;
};
export type Locate = LocateOptions & {
    totalPages: number;
};
export declare const createLocate: () => (options?: LocateOptions) => Locate;
