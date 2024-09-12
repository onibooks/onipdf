import type { GlobalContext } from '../provider';
import type { LocateOptions } from '../rendition/locate/createLocate';
export declare const locate: (context: GlobalContext) => (options?: LocateOptions) => import("../rendition/locate/createLocate").Locate;
