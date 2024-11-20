import type { GlobalContext } from '../../provider';
type SingleProps = {
    context: GlobalContext;
<<<<<<< Updated upstream
    observer: IntersectionObserver | null;
    pageViewRefs: any;
};
declare const Single: ({ context, observer, pageViewRefs }: SingleProps) => import("preact").JSX.Element;
=======
};
declare const Single: ({ context }: SingleProps) => import("preact").JSX.Element;
>>>>>>> Stashed changes
export default Single;
