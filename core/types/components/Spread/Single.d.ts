import type { GlobalContext } from '../../provider';
type SingleProps = {
    context: GlobalContext;
};
declare const Single: ({ context }: SingleProps) => import("preact").JSX.Element;
export default Single;
