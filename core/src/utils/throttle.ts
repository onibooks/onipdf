// From: GPT-4o
export const throttle = <T extends (...args: any[]) => void>(fn: T, wait: number): ((...args: Parameters<T>) => void) => {
  let isThrottling = false

  return (...args: Parameters<T>) => {
    if (!isThrottling) {
      fn(...args)
      isThrottling = true
      setTimeout(() => {
        isThrottling = false
      }, wait)
    }
  }
}