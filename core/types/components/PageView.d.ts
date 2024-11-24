import type { GlobalContext } from '../provider';
type Size = {
    width: number;
    height: number;
};
type PageViewProps = {
    context: GlobalContext;
    pageSize: Size;
    pageIndex: number;
    pageRender: (value: unknown) => void;
};
declare const PageView: ({ context, pageSize, pageIndex, pageRender }: PageViewProps) => import("preact").JSX.Element;
export default PageView;
