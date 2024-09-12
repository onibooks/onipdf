import type { GlobalContext } from '../provider';
type OniPageProps = {
    context: GlobalContext;
    index: number;
};
declare const OniPage: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<OniPageProps> & {
    ref?: import("preact").Ref<HTMLDivElement> | undefined;
}>;
export default OniPage;
