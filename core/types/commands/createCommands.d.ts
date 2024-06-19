import * as commands from '.';
export type Commands = {
    [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>;
};
export declare const createCommands: () => {};
