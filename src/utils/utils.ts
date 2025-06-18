import type { ResourcesRefs } from '../types/Widget'

export const getResourceRef = (resourceRefId: string, resourcesRefs: ResourcesRefs) => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('Cannot find resources refs')
  }

  const backendEndpoint = resourcesRefs.find((endpoint) => {
    return endpoint.id === resourceRefId
  })

  if (!backendEndpoint) {
    throw new Error(`Cannot find resource ref with ID ${resourceRefId}`)
  }

  return backendEndpoint
}

export const getEndpointUrl = (resourceRefId: string, resourcesRefs: ResourcesRefs): string => {
  const backendEndpoint = getResourceRef(resourceRefId, resourcesRefs)

  return backendEndpoint.path
}

export const getResourceEndpoint = ({
  apiVersion,
  name,
  namespace,
  resource,
}: {
  resource: string
  apiVersion: string
  name: string
  namespace: string
}): string => {
  return `/call?resource=${resource}&apiVersion=${apiVersion}&name=${name}&namespace=${namespace}`
}

export const formatISODate = (value: string, showTime: boolean = false) => {
  return showTime
    ? new Date(value).toLocaleDateString('en', {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
}
