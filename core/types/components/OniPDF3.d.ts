import type { GlobalContext } from '../provider';
import { h } from 'preact';
type OniPDFProps = {
    context: GlobalContext;
};
declare const OniPDF: ({ context }: OniPDFProps) => h.JSX.Element;
export default OniPDF;
