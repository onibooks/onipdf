import { type Commands } from './commands/createCommands';
export type Options = {
    muPDFSrc: string;
};
export type BookInstance = Commands & {};
export declare const createObject: <T extends object, P extends object>(proto: T, props: P) => any;
export declare const createBook: ({ muPDFSrc }: Options) => Promise<Commands>;
