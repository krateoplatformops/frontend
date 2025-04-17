import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import { useNavigate } from 'react-router'

import type { ButtonSchema } from '../../types/Button.schema'

interface Props {
  widgetData: ButtonSchema['spec']['widgetData']
  actions: ButtonSchema['spec']['actions']
  backendEndpoints: ButtonSchema['spec']['backendEndpoints']
}

type NavigateActionType = NonNullable<ButtonSchema['spec']['actions']['navigate']>[number]
type OpenDrawerActionType = NonNullable<ButtonSchema['spec']['actions']['openDrawer']>[number]
type OpenModalActionType = NonNullable<ButtonSchema['spec']['actions']['openModal']>[number]
type RestActionType = NonNullable<ButtonSchema['spec']['actions']['rest']>[number]

type AllActionsType = NavigateActionType | OpenDrawerActionType | OpenModalActionType | RestActionType

const Button: React.FC<Props> = ({ widgetData: data, actions, backendEndpoints }) => {
  const { label, icon, type } = data
  const navigate = useNavigate()

  const allActions: AllActionsType[] = [
    ...(actions.navigate ?? []),
    ...(actions.openDrawer ?? []),
    ...(actions.openModal ?? []),
    ...(actions.rest ?? []),
  ]

  const buttonAction = allActions.find((action) => action.id === data.clickActionId)
  if (!buttonAction) {
    throw new Error(`Actions with id ${data.clickActionId} not found`)
  }

  function getEndpointUrl(backendEndpointId: string, backendEndpoints: ButtonSchema['spec']['backendEndpoints']) {
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

  async function onClick() {
    if (buttonAction) {
      switch (buttonAction.type) {
        case 'navigate': {
          if (buttonAction.requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(buttonAction.backendEndpointId, backendEndpoints)
              await navigate(url)
            }
          }
          break
        }
        case 'rest': {
          if (buttonAction.requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              const url = getEndpointUrl(buttonAction.backendEndpointId, backendEndpoints)
              await fetch(url, {
                method: buttonAction.verb,
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
    }
  }

  return (
    <AntButton icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined} onClick={onClick} type={type}>
      {label}
    </AntButton>
  )
}

export default Button
