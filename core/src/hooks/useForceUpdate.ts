import { useCallback, useState } from 'react'

const createNewObject = (): Record<string, never> => ({})

export const useForceUpdate = (): VoidFunction => {
  const [, setValue] = useState<Record<string, never>>(createNewObject)

  return useCallback((): void => {
    setValue(createNewObject())
  }, [])
}