import * as commands from './commands.js';
import * as MuPDF from 'mupdf';
export type Commands = {
    [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>;
};
export type WorkerContext = {
    mupdf: typeof MuPDF;
    document: MuPDF.Document;
    commands: Commands;
};
