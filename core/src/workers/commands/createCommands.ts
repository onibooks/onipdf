import * as commands from './index.js'

import type { WorkerContext } from '../worker.js'

export type Commands = {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

export const createCommands = (context: WorkerContext) => (
  Object.entries(commands).reduce((commandSet, [commandKey, commandFn]) => {
    if (typeof commandFn === 'function') {
      (commandSet as any)[commandKey] = commandFn(context)
    }

    return commandSet
  }, {})
)