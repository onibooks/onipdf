import type { GlobalContext } from '../../provider';
type SingleProps = {
    context: GlobalContext;
    observer: IntersectionObserver | null;
    pageViewRefs: any;
};
declare const Single: ({ context, observer, pageViewRefs }: SingleProps) => import("preact").JSX.Element;
export default Single;
