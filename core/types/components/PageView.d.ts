import type { GlobalContext } from '../provider';
type PageViewProps = {
    context: GlobalContext;
    pageIndex: number;
    onRendered?: () => void;
};
declare const PageView: ({ context, pageIndex, onRendered }: PageViewProps) => import("preact").JSX.Element;
export default PageView;
