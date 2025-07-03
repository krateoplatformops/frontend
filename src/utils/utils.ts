import type { ResourcesRefs } from '../types/Widget'

export const getResourceRef = (resourceRefId: string, resourcesRefs: ResourcesRefs) => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    console.error(`Cannot find resources refs for resource ref with ID ${resourceRefId}`)
    return
  }

  const backendEndpoint = resourcesRefs.find(({ id }) => {
    return id === resourceRefId
  })

  if (!backendEndpoint) {
    console.error(`Cannot find resource ref with ID ${resourceRefId}`)
  }

  return backendEndpoint
}

export const getEndpointUrl = (resourceRefId: string, resourcesRefs: ResourcesRefs) => {
  const backendEndpoint = getResourceRef(resourceRefId, resourcesRefs)

  return backendEndpoint?.path
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

export const getHeadersObject = (headers: string[]) => {
  return headers.reduce(
    (acc, header) => {
      const [key, value] = header.split(':')
      acc[key.trim()] = value.trim()
      return acc
    },
    {} as Record<string, string>
  )
}
