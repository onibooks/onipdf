type ResponseType = {
    responseType?: XMLHttpRequestResponseType;
};
type HttpRequestInit = RequestInit & ResponseType | undefined;
export declare const request: (from: string | URL | Request, init?: HttpRequestInit) => Promise<any>;
export {};
