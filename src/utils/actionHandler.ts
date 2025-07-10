import { useQueryClient } from '@tanstack/react-query'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import type { WidgetAction } from '../types/Widget'
import { openDrawer } from '../widgets/Drawer/Drawer'
import { openModal } from '../widgets/Modal/Modal'

import { getAccessToken } from './getAccessToken'
import type { RestApiResponse } from './types'
import { getHeadersObject } from './utils'

export const handleAction = async (action: WidgetAction, path: string, verb?: 'GET' | 'POST' | 'DELETE') => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notification } = useApp()
  const { id, requireConfirmation, type } = action

  switch (type) {
    case 'navigate':
      if (!requireConfirmation || window.confirm('Are you sure?')) {
        await navigate(path)
      }

      break
    case 'openDrawer': {
      const { size, title } = action

      openDrawer({ size, title, widgetEndpoint: path })

      break
    }
    case 'openModal': {
      const { title } = action

      openModal({ title, widgetEndpoint: path })

      break
    }
    case 'rest': {
      const { errorMessage, headers = [], onSuccessNavigateTo, payload, successMessage } = action

      if (!requireConfirmation || window.confirm('Are you sure?')) {
        if (verb === 'POST' && !payload) {
          console.warn(`Payload not found for POST action ${id}`)
        }

        const res = await fetch(path, {
          body: JSON.stringify(payload),
          headers: {
            ...getHeadersObject(headers),
            Authorization: `Bearer ${getAccessToken()}`,
          },
          method: verb,
        })

        const json = (await res.json()) as RestApiResponse

        if (!res.ok) {
          notification.error({
            description: errorMessage || json.message,
            message: `${json.status} - ${json.reason}`,
            placement: 'bottomLeft',
          })
          break
        }

        const actionName = verb === 'DELETE' ? 'deleted' : 'created'
        notification.success({
          description: successMessage || `Successfully ${actionName} ${json.metadata?.name} in ${json.metadata?.namespace}`,
          message: json.message,
          placement: 'bottomLeft',
        })

        await queryClient.invalidateQueries()

        if (onSuccessNavigateTo) {
          await navigate(onSuccessNavigateTo)
        }
      }

      break
    }
    default: break
  }
}
