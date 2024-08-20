import { type Commands } from './commands/createCommands.js';
import * as MuPDF from 'mupdf';
export type WorkerContext = {
    mupdf: typeof MuPDF;
    document: MuPDF.Document;
    commands: Commands;
    PDFPages: any[];
};
