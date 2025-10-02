import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'

import type { ResourcesRefs } from '../../../types/Widget'
import { getResourceRef } from '../../../utils/utils'

export const getOptionsFromResourceRefId = async (
  value: string | undefined,
  resourceRefId: string,
  resourcesRefs: ResourcesRefs,
  valueKey: string
): Promise<DefaultOptionType[]> => {
  const { notification } = useApp()

  const resourceRef = getResourceRef(resourceRefId, resourcesRefs)

  if (!resourceRef) {
    notification.error({
      description: `Cannot find resources refs for resource ref with ID ${resourceRefId}`,
      message: 'Error while retrieving options',
      placement: 'bottomLeft',
    })

    return []
  }

  try {
    const { path, verb } = resourceRef

    const url = new URL(path)
    url.searchParams.set('extras', JSON.stringify({ [valueKey]: value }))

    const response = await fetch(url.toString(), {
      ...(verb === 'POST' && { headers: { 'Content-Type': 'application/json' } }),
      method: verb,
    })

    if (!response.ok) {
      notification.error({
        description: 'No response received',
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })

      return []
    }

    const data = await response.json() as DefaultOptionType[]
    return data
  } catch (error) {
    notification.error({
      description: 'There has been an unhandled error while retrieving field options',
      message: 'Error while retrieving options',
      placement: 'bottomLeft',
    })
    console.error('getOptionsFromResourceRefId error:', error)

    return []
  }
}
