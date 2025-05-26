/* eslint-disable max-depth */
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntdButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { ResourcesRefs, WidgetProps } from '../../types/Widget'
import type { Action } from '../../utils/types'
import { getEndpointUrl } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'

import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const createNginxPodEndpoint = (
  baseUrl: string,
  resourcesRefs: ResourcesRefs,
) => {
  if (!resourcesRefs || resourcesRefs.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  return `${baseUrl}/call?resource=pods&apiVersion=v1&name=my-pod-x&namespace=krateo-system`
}

const Button = ({ actions, resourcesRefs, uid, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { clickActionId, color, icon, label, size, type } = widgetData

  const navigate = useNavigate()
  const { config } = useConfigContext()
  const { notification } = useApp()

  const onClick = async () => {
    const buttonAction = Object.values(actions as Action[])
      .flat()
      .find(({ id }) => id === clickActionId)

    if (buttonAction) {
      const { requireConfirmation, resourceRefId, type } = buttonAction

      switch (type) {
        case 'navigate': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(resourceRefId, resourcesRefs,)
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = createNginxPodEndpoint(config!.api.BACKEND_API_BASE_URL, resourcesRefs)
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

              type NginxResponse = {
                message: string
                metadata: {
                  name: string
                }
                reason: string
                status: string
              }
              const json = await res.json() as NginxResponse

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
    <AntdButton
      color={color || 'default'}
      icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
      key={uid}
      onClick={handleClick}
      size={size || 'middle'}
      type={type || 'primary'}
    >
      {label}
    </AntdButton>
  )
}

export default Button
