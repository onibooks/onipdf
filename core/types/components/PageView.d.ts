import type { GlobalContext } from '../provider';
type Size = {
    width: number;
    height: number;
};
type PageViewProps = {
    context: GlobalContext;
    pageMaxSize: Size;
    pageSize: Size;
    pageIndex: number;
    pageRender: (value: unknown) => void;
    onUpdateComplete?: any;
};
declare const PageView: ({ context, pageMaxSize, pageSize, pageIndex, pageRender, onUpdateComplete }: PageViewProps) => import("preact").JSX.Element;
export default PageView;
