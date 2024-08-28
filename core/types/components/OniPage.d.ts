import type { GlobalContext } from '../provider';
type OniPageProps = {
    context: GlobalContext;
    index: number;
};
declare const OniPage: ({ context, index }: OniPageProps) => import("preact").JSX.Element;
export default OniPage;
