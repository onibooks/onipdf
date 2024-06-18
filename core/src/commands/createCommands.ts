import { provider } from '../provider'
import * as commands from '.'

export type Commands = {
  [Key in keyof typeof commands]: ReturnType<typeof commands[Key]>
}

export const createCommands = () => provider((context) => (
  Object.entries(commands).reduce((commandSet, [commandKey, commandFn]) => {
    if (typeof commandFn === 'function') {
      (commandSet as any)[commandKey] = commandFn(context)
    }

    return commandSet
  }, {})
))