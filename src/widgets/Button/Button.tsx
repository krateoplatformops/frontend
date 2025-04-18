import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import { useNavigate } from 'react-router'

import type { ButtonSchema } from '../../types/Button.schema'
import { Action } from '../../utils/types'

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

const Button: React.FC<Props> = ({ widgetData: data, actions, backendEndpoints }) => {
  const { color, clickActionId, label, icon, size, type } = data
  const navigate = useNavigate()

  const onClick = async () => {
    const buttonAction = Object.values(actions as Action[]).find(({ id }) => id === clickActionId)

    if (buttonAction) {
      const { backendEndpointId, requireConfirmation, type, verb } = buttonAction

      switch (type) {
        case 'navigate': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(backendEndpointId, backendEndpoints)
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(backendEndpointId, backendEndpoints)
              await fetch(url, {
                method: verb,
              })
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

  return (
    <AntButton
      color={color || 'default'}
      icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
      onClick={onClick}
      size={size || 'middle'}
      type={type || 'primary'}
    >
      {label}
    </AntButton>
  )
}

export default Button
