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

export const getEndpointUrl = (resourceRefId: string, resourcesRefs: Widget['status']['resourcesRefs']): string => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  const backendEndpoint = resourcesRefs.find((endpoint) => {
    return endpoint.id === resourceRefId
  })

  if (!backendEndpoint) {
    throw new Error(`cannot find backend endpoint with ID ${resourceRefId}`)
  }

  return backendEndpoint.path
}

export const getResourceEndpoint = ({
  resource,
  version,
  name,
  namespace,
}: {
  resource: string
  version: string
  name: string
  namespace: string
}): string => {
  return `/call?resource=${resource}&apiVersion=widgets.templates.krateo.io/${version}&name=${name}&namespace=${namespace}`
}
