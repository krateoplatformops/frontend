import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { ButtonSchema } from '../../types/Button.schema'
import type { Action } from '../../utils/types'

interface Props {
  widgetData: ButtonSchema['spec']['widgetData']
  actions: ButtonSchema['spec']['actions']
  backendEndpoints: ButtonSchema['spec']['backendEndpoints']
}

const getEndpointUrl = (backendEndpointId: string, backendEndpoints: ButtonSchema['spec']['backendEndpoints']) => {
  if (!backendEndpoints || backendEndpoints.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  const backendEndpoint = backendEndpoints.find((endpoint) => {
    return endpoint.id === backendEndpointId
  })

  if (!backendEndpoint) {
    throw new Error('cannot find backend endpoint for navigate action')
  }

  return backendEndpoint.endpoint
}

type BackendEndpointFromSpec = {
  apiVersion: string
  id: string
  name: string
  namespace: string
  resource: string
  verb: string
}

/* eslint-disable-next-line */
const HACK_getEndpointUrl = (
  baseUrl: string,
  backendEndpointId: string,
  backendEndpoints: Array<BackendEndpointFromSpec>,
) => {
  /* HACK: creating endpoint as snowplow would do while waiting for snowplow to implement it */
  if (!backendEndpoints || backendEndpoints.length === 0) {
    throw new Error('cannot find backend endpoints')
  }

  const backendEndpoint = backendEndpoints.find((endpoint) => {
    return endpoint.id === backendEndpointId
  })

  return `${baseUrl}/call?resource=pods&apiVersion=v1&name=my-pod&namespace=krateo-system`
}

const Button: React.FC<Props> = ({ widgetData: data, actions, backendEndpoints }) => {
  const { color, clickActionId, label, icon, size, type } = data
  const navigate = useNavigate()
  const { config } = useConfigContext()
  const [result, setResult] = useState<any>(null)
  const { notification } = useApp()

  useEffect(() => {
    if (result) {
      notification.success({
        description: `Pod ${result.metadata.name} created successfully`,
        message: '🐳 Pod created successfully',
      })
    }
  }, [result])

  const onClick = async () => {
    const buttonAction = Object.values(actions as Action[])
      .flat()
      .find(({ id }) => id === clickActionId)
    if (buttonAction) {
      const { backendEndpointId, requireConfirmation, type, verb } = buttonAction

      switch (type) {
        case 'navigate': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = HACK_getEndpointUrl(
                config!.api.BACKEND_API_BASE_URL,
                backendEndpointId,
                backendEndpoints as unknown as BackendEndpointFromSpec[],
              )
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = HACK_getEndpointUrl(
                config!.api.BACKEND_API_BASE_URL,
                backendEndpointId,
                backendEndpoints as unknown as BackendEndpointFromSpec[],
              )
              const res = await fetch(url, {
                body: JSON.stringify({
                  apiVersion: 'v1',
                  kind: 'Pod',
                  metadata: {
                    name: `nginx-pod-${Date.now()}`,
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
              const json = (await res.json()) as unknown
              setResult(json)
            }
          }
          break
        }
        case 'openDrawer': {
          /* TODO: implement open drawer action */
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
