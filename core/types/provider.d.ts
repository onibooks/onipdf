/**
 * 여러 모듈에서 공유할 수 있는 컨텍스트를 제공합니다.
 * 'provider' 함수는 호출되는 시점에 따라 어떤 컨텍스트가 사용될지 결정되므로 호출 시점을 주의 깊게 고려해야 합니다.
 * 'Provider', 'Context'와 같은 용어는 React의 Context API를 연상시키지만, React와는 관련이 없습니다.
 */
import type { OniPDF } from './createBook';
import type { Emotion } from '@emotion/css/create-instance';
import type { StoreApi } from 'zustand/vanilla';
import type { Sangte } from './sangte';
import type { MuPDFWorker } from './workers/createWorker';
import type { Options } from './commands/render';
import type { Presentation } from './presentation';
export type PageRect = {
    top: number;
    width: number;
    height: number;
};
export type PageView = {
    cached: boolean;
    rect: PageRect;
    pageIndex: number;
};
export type PageViews = {
    rect: PageRect;
    pageIndex: number;
};
export type SpreadPage = {
    index: number;
    cached: boolean;
    rect: PageRect;
    pages: PageViews[];
};
export type GlobalContext = {
    oniPDF: OniPDF;
    worker: MuPDFWorker;
    sangte: StoreApi<Sangte>;
    emotion: Emotion;
    rootElement: HTMLElement;
    documentElement: HTMLElement;
    options: Options;
    pageView: PageView[];
    pageViews: SpreadPage[];
    presentation: Presentation;
    uid: number;
};
export declare const createContext: () => GlobalContext;
/**
 * consumer라는 함수는 context라는 매개변수를 가지는데 context의 타입은 GlobalContext
 * 전역에 있는 uid로 전역에 있는 globalContext에서 현재 context를 구해주고
 * consumer의 매개변수로 context를 넣어주면 현재 context를 return하게된다.
 */
export declare const provider: <T>(consumer: (context: GlobalContext) => T) => T;
