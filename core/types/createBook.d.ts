import { type Events } from './events';
import { type Commands } from './commands/createCommands';
export type Options = {
    muPDFSrc: string;
};
export type OniPDF = Commands & Events & {};
export declare const createObject: <T extends object, P extends object>(proto: T, props: P) => any;
export declare const createBook: (url: string, options: Options) => Promise<OniPDF>;
