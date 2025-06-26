import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryClient } from '@tanstack/react-query'
import { Button as AntdButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { ResourceRef, WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import type { RestApiResponse } from '../../utils/types'
import { getEndpointUrl, getResourceRef } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'
import { openModal } from '../Modal/Modal'

import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const Button = ({ resourcesRefs, uid, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { actions, clickActionId, color, icon, label, shape, size, type } = widgetData

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { config } = useConfigContext()
  const { notification } = useApp()

  const onClick = async () => {
    const action = Object.values(actions)
      .flat()
      .find(({ id }) => id === clickActionId)

    if (action) {
      const { requireConfirmation, type } = action

      switch (type) {
        case 'navigate': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(action.resourceRefId, resourcesRefs)
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          const { errorMessage, id, payload, successMessage } = action

          if (requireConfirmation) {
            const confirmed = window.confirm('Are you sure?')
            if (!confirmed) {
              break
            }
          }

          let resourceRef: ResourceRef
          try {
            resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)
          } catch (error) {
            notification.error({
              description: error instanceof Error ? error.message : String(error),
              message: `Error while retrieving the resource`,
              placement: 'bottomLeft',
            })
            break
          }

          const url = config?.api.SNOWPLOW_API_BASE_URL + resourceRef.path

          const method = resourceRef.verb
          if (method === 'POST' && !payload) {
            console.warn(`Payload not found for POST action ${id}`)
          }

          const res = await fetch(url, {
            body: JSON.stringify(payload),
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
            method,
          })

          const json = await res.json() as RestApiResponse
          if (!res.ok) {
            notification.error({
              description: errorMessage || json.message,
              message: `${json.status} - ${json.reason}`,
              placement: 'bottomLeft',
            })
            break
          }

          const actionName = method === 'DELETE' ? 'deleted' : 'created'
          notification.success({
            description: successMessage || `Successfully ${actionName} ${json.metadata?.name} in ${json.metadata?.namespace}`,
            message: json.message,
            placement: 'bottomLeft',
          })

          await queryClient.invalidateQueries()
          if (action.onSuccessNavigateTo) {
            void navigate(action.onSuccessNavigateTo)
          }

          break
        }
        case 'openDrawer': {
          const { resourceRefId, size, title } = action
          const widgetEndpoint = getEndpointUrl(resourceRefId, resourcesRefs)
          openDrawer({ size, title, widgetEndpoint })
          break
        }
        case 'openModal': {
          const { resourceRefId, title } = action
          const widgetEndpoint = getEndpointUrl(resourceRefId, resourcesRefs)
          openModal({ title, widgetEndpoint })
          break
        }
        default:
          throw new Error(`Unsupported action type}`)
      }
    } else {
      throw new Error(`Actions with id ${clickActionId} not found`)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()

    onClick().catch((error) => {
      console.error('Error in button click handler:', error)
    })
  }

  return (
    <div>
      <AntdButton
        color={color || 'default'}
        icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
        key={uid}
        onClick={(event) => handleClick(event)}
        shape={shape || 'default'}
        size={size || 'middle'}
        type={type || 'primary'}
      >
        {label}
      </AntdButton>
    </div>
  )
}

export default Button
