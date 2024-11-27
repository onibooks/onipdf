export type LocateOptions = {
    currentPage?: number;
    totalPages?: number;
};
export type Locate = LocateOptions & {};
export declare const createLocate: () => (options?: LocateOptions) => Locate;
