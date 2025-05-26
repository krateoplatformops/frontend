import type { Widget } from '../types/Widget'

export const getResourceRef = (
  resourceRefId: string,
  resourcesRefs: Widget['status']['resourcesRefs'],
) => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('cannot find resources refs')
  }

  const backendEndpoint = resourcesRefs.find((endpoint) => {
    return endpoint.id === resourceRefId
  })

  if (!backendEndpoint) {
    throw new Error(`cannot find resource ref with ID ${resourceRefId}`)
  }

  return backendEndpoint
}

export const getEndpointUrl = (
  resourceRefId: string,
  resourcesRefs: Widget['status']['resourcesRefs'],
): string => {
  const backendEndpoint = getResourceRef(resourceRefId, resourcesRefs)

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
