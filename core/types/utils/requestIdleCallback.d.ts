type IdleDeadline = {
    didTimeout: boolean;
    timeRemaining: () => number;
};
type IdleCallback = (deadline: IdleDeadline) => void;
interface IdleOptions {
    timeout?: number;
}
export declare const requestIdleCallback: (handler: IdleCallback, options?: IdleOptions) => number | NodeJS.Timeout;
export {};
