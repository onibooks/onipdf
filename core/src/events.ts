import EventEmitter from 'eventemitter3'

export type Events = {
  on: EventEmitter['on']
  off: EventEmitter['off']
  once: EventEmitter['once']
  emit: EventEmitter['emit']
  removeAllListeners: EventEmitter['removeAllListeners']
}

export const createEvents =  () => {
  const events = new EventEmitter()

  const on = events.on.bind(events)
  const off = events.off.bind(events)
  const once = events.once.bind(events)
  const emit = events.emit.bind(events)
  const removeAllListeners = events.removeAllListeners.bind(events)

  return {
    on,
    off,
    once,
    emit,
    removeAllListeners
  }
}