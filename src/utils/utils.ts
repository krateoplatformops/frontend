
import type { Widget } from '../types/Widget'

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
