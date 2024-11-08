import type { GlobalContext } from '../provider';
type PageViewProps = {
    context: GlobalContext;
    pageIndex: number;
};
declare const PageView: ({ context, pageIndex }: PageViewProps) => import("preact").JSX.Element;
export default PageView;
