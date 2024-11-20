import type { GlobalContext } from '../provider';
<<<<<<< Updated upstream
type PageViewProps = {
    context: GlobalContext;
    pageIndex: number;
    observer: IntersectionObserver | null;
};
declare const PageView: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<PageViewProps> & {
    ref?: import("preact").Ref<unknown> | undefined;
}>;
=======
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
declare const PageView: ({ context, pageSize, pageIndex, pageRender }: PageViewProps) => import("preact/compat").JSX.Element;
>>>>>>> Stashed changes
export default PageView;
