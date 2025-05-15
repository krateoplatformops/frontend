
import type { Widget } from '../types/Widget'

export const getEndpointUrl = (resourceRefId: string, resourcesRefs: Widget['status']['resourcesRefs']): string => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('cannot find resources refs')
  }

  const backendEndpoint = resourcesRefs.find((endpoint) => {
    return endpoint.id === resourceRefId
  })

  if (!backendEndpoint) {
    throw new Error(`cannot find resource ref with ID ${resourceRefId}`)
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

export const formatISODate = (value: string, showTime: boolean = false) => (
  showTime
    ? new Date(value).toLocaleDateString('en', { day: 'numeric', hour: 'numeric', minute: 'numeric', month: 'long', year: 'numeric' })
    : new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
)
