import EventEmitter from 'eventemitter3';
export type Events = {
    on: EventEmitter['on'];
    off: EventEmitter['off'];
    once: EventEmitter['once'];
    emit: EventEmitter['emit'];
    removeAllListeners: EventEmitter['removeAllListeners'];
};
export declare const createEvents: () => {
    on: any;
    off: any;
    once: any;
    emit: any;
    removeAllListeners: any;
};
