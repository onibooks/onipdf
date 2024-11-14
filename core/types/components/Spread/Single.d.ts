import type { GlobalContext } from '../../provider';
type SingleProps = {
    context: GlobalContext;
    onRendered?: () => void;
};
declare const Single: ({ context, onRendered }: SingleProps) => import("preact").JSX.Element;
export default Single;
