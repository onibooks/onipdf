export type Options = {
    muPDFSrc: string;
};
export type BookInstance = {};
export declare const createObject: <T extends object, P extends object>(proto: T, props: P) => any;
export declare const createBook: ({ muPDFSrc }: Options) => Promise<BookInstance>;
