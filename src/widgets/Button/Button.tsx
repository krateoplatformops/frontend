import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import { openDrawer } from '../../Drawer'
import type { ButtonSchema } from '../../types/Button.schema'
import type { WidgetProps } from '../../types/Widget'
import type { Action } from '../../utils/types'
import { getEndpointUrl, getResourceRef } from '../../utils/utils'

type BackendEndpointFromSpec = {
  apiVersion: string
  id: string
  name: string
  namespace: string
  resource: string
  verb: string
}

const createNginxPodEndpoint = (
  baseUrl: string,
  resourceRefId: string,
  resourcesRefs: Array<BackendEndpointFromSpec>,
) => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  return `${baseUrl}/call?resource=pods&apiVersion=v1&name=my-pod-x&namespace=krateo-system`
}

const Button = ({
  widgetData,
  actions,
  resourcesRefs,
}: WidgetProps<ButtonSchema['status']['widgetData']>) => {
  const { color, clickActionId, label, icon, size, type } = widgetData

  const navigate = useNavigate()
  const { config } = useConfigContext()
  const { notification } = useApp()

  const onClick = async () => {
    const buttonAction = Object.values(actions as Action[])
      .flat()
      .find(({ id }) => id === clickActionId)
    if (buttonAction) {
      const {
        resourceRefId,
        requireConfirmation,
        type,
        payload,
        id: actionId,
      } = buttonAction

      switch (type) {
        case 'navigate': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(
                resourceRefId,
                resourcesRefs as unknown as BackendEndpointFromSpec[],
              )
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          if (requireConfirmation) {
            const confirmed = window.confirm('Are you sure?')
            if (!confirmed) {
              break
            }
          }
          const resourceRef = getResourceRef(resourceRefId, resourcesRefs)
          const url = config?.api.BACKEND_API_BASE_URL + resourceRef.path
          debugger
          if (resourceRef.verb === 'POST' && !payload) {
            console.warn(`Payload not found for POST action ${actionId}`)
          }

          const res = await fetch(url, {
            body: JSON.stringify(payload),
            headers: {
              'X-Krateo-Groups': 'admins',
              'X-Krateo-User': 'admin',
            },
            method: 'POST',
          })
          const json = await res.json()
          if (!res.ok) {
            notification.error({
              description: json.message,
              message: `${json.status} - ${json.reason}`,
              placement: 'bottomLeft',
            })
          }
          debugger
          notification.success({
            description: `Successfully created ${json.metadata.name} in ${json.metadata.namespace}`,
            message: json.message,
            placement: 'bottomLeft',
          })
          break
        }
        case 'openDrawer': {
          const widgetEndpoint = getEndpointUrl(resourceRefId, resourcesRefs)

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

  const handleClick = () => {
    onClick().catch((error) => {
      console.error('Error in button click handler:', error)
    })
  }

  return (
    <AntButton
      color={color || 'default'}
      icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
      onClick={handleClick}
      size={size || 'middle'}
      type={type || 'primary'}
    >
      {label}
    </AntButton>
  )
}

export default Button
