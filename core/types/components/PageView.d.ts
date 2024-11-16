import type { GlobalContext } from '../provider';
type PageViewProps = {
    context: GlobalContext;
    pageIndex: number;
    observer: IntersectionObserver | null;
};
declare const PageView: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<PageViewProps> & {
    ref?: import("preact").Ref<unknown> | undefined;
}>;
export default PageView;
