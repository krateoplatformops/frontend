import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryClient } from '@tanstack/react-query'
import { Button as AntdButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import { getEndpointUrl, getResourceRef } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'

import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const Button = ({ actions, resourcesRefs, uid, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { clickActionId, color, icon, label, shape, size, type } = widgetData

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { config } = useConfigContext()
  const { notification } = useApp()

  const onClick = async () => {
    const action = Object.values(actions ?? {})
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
          const { id, payload } = action

          if (requireConfirmation) {
            const confirmed = window.confirm('Are you sure?')
            if (!confirmed) {
              break
            }
          }
          const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)
          const url = config?.api.BACKEND_API_BASE_URL + resourceRef.path

          const method = resourceRef.verb
          if (method === 'POST' && !payload) {
            console.warn(`Payload not found for POST action ${id}`)
          }

          const res = await fetch(url, {
            body: JSON.stringify(payload),
            headers: {
              // 'X-Krateo-Groups': 'admins',
              // 'X-Krateo-User': 'admin',
              Authorization: `Bearer ${getAccessToken()}`,
            },
            method,
          })

          // TODO: write this type
          const json = await res.json()
          if (!res.ok) {
            notification.error({
              description: json.message,
              message: `${json.status} - ${json.reason}`,
              placement: 'bottomLeft',
            })
            break
          }

          const actionName = method === 'DELETE' ? 'deleted' : 'created'
          notification.success({
            description: `Successfully ${actionName} ${json.metadata.name} in ${json.metadata.namespace}`,
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
          const widgetEndpoint = getEndpointUrl(action.resourceRefId, resourcesRefs)
          openDrawer(widgetEndpoint)
          break
        }
        case 'openModal': {
          /* TODO: implement open modal action */
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
  )
}

export default Button
