export declare const throttle: <T extends (...args: any[]) => void>(fn: T, wait: number) => ((...args: Parameters<T>) => void);
