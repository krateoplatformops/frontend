/* eslint-disable max-depth */
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { ButtonSchema } from '../../types/Button.schema'
import type { WidgetProps } from '../../types/Widget'
import type { Action } from '../../utils/types'
import { getEndpointUrl } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'

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
      const { resourceRefId, requireConfirmation, type, verb } = buttonAction

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
            if (window.confirm('Are you sure?')) {
              const url = createNginxPodEndpoint(
                config!.api.BACKEND_API_BASE_URL,
                resourceRefId,
                resourcesRefs as unknown as BackendEndpointFromSpec[],
              )
              const res = await fetch(url, {
                body: JSON.stringify({
                  apiVersion: 'v1',
                  kind: 'Pod',
                  metadata: {
                    name: `nginx-pod-x`,
                  },
                  spec: {
                    containers: [
                      {
                        image: 'nginx:latest',
                        name: 'nginx',
                        ports: [
                          {
                            containerPort: 80,
                          },
                        ],
                      },
                    ],
                  },
                }),
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

              notification.success({
                description: `Pod ${json.metadata.name} created successfully`,
                message: '🐳 Pod created successfully',
                placement: 'bottomLeft',
              })
            }
          }
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
