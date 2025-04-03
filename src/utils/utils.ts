import { useNavigate } from 'react-router'

import type { Action } from './types'

export const getActionsMap = (actions: Action[] | undefined) => {
  const navigate = useNavigate()

  if (!actions) {
    return {}
  }

  return actions.reduce(
    (acc, action) => {
      if (!action.name) {
        return acc
      }

      switch (action.type) {
        case 'navigate':
          acc[action.name] = () => {
            if (action.url) {
              void navigate(action.url)
            }
          }
          break
        default:
          acc[action.name] = () => {
            console.warn(`Action type "${action.type}" non gestito.`)
          }
      }

      return acc
    },
    {} as Record<string, () => void>
  )
}
