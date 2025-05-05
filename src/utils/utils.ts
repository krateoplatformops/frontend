import { useNavigate } from 'react-router'

import type { Widget } from '../types/Widget'

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
    {} as Record<string, () => void>,
  )
}

export const getEndpointUrl = (
  backendEndpointId: string,
  backendEndpoints: Widget['status']['backendEndpoints'],
): string => {
  if (!backendEndpoints || backendEndpoints.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  const backendEndpoint = backendEndpoints.find((endpoint) => {
    return endpoint.id === backendEndpointId
  })

  if (!backendEndpoint) {
    throw new Error(`cannot find backend endpoint with ID ${backendEndpointId}`)
  }

  return backendEndpoint.path
}
