import type { GlobalContext } from '../../provider';
type DoubleProps = {
    context: GlobalContext;
};
declare const Double: ({ context }: DoubleProps) => import("preact").JSX.Element;
export default Double;
