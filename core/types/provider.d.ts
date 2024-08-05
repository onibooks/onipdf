/**
 * 여러 모듈에서 공유할 수 있는 컨텍스트를 제공합니다.
 * 'provider' 함수는 호출되는 시점에 따라 어떤 컨텍스트가 사용될지 결정되므로 호출 시점을 주의 깊게 고려해야 합니다.
 * 'Provider', 'Context'와 같은 용어는 React의 Context API를 연상시키지만, React와는 관련이 없습니다.
 */
import type { OniPDF } from './createBook';
import type { Sangte } from './sangte';
import type { MuPDFWorker } from './workers/createWorker';
export type PagesType = {
    page: any;
    pageSize: {
        width: number;
        height: number;
    };
    pageText: any;
    pageLinks: any;
    pixmap: any;
};
export type GlobalContext = {
    uid: number;
    oniPDF: OniPDF;
    worker: MuPDFWorker;
    sangte: Sangte;
    pages: PagesType[];
};
export declare const createContext: () => GlobalContext;
/**
 * consumer라는 함수는 context라는 매개변수를 가지는데 context의 타입은 GlobalContext
 * 전역에 있는 uid로 전역에 있는 globalContext에서 현재 context를 구해주고
 * consumer의 매개변수로 context를 넣어주면 현재 context를 return하게된다.
 */
export declare const provider: <T>(consumer: (context: GlobalContext) => T) => T;
