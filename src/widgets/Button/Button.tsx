import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import { useNavigate } from 'react-router'

import type { ButtonSchema } from '../../types/Button.schema'

interface Props {
  widgetData: ButtonSchema['spec']['widgetData']
  actions?: ButtonSchema['spec']['actions']
}

const getActions = (actions: ButtonSchema['spec']['actions'] = [], navigate: ReturnType<typeof useNavigate>) => {
  return actions.reduce(
    (acc, action) => {
      if (!action.name) {
        return acc
      }

      switch (action.type) {
        case 'navigate':
          if (action.url) {
            acc[action.name] = () => {
              void navigate(action.url)
            }
          }
          break
        default:
          acc[action.name] = () => {
            console.warn(`Action type "${action.type}" non gestito.`)
          }
      }

      return acc
    },
    {} as Record<string, () => void>
  )
}

const Button: React.FC<Props> = ({ widgetData, actions }) => {
  const navigate = useNavigate()

  const { label, icon, type } = widgetData
  const actionsMap = getActions(actions, navigate)

  return (
    <AntButton
      icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
      onClick={actionsMap['onClick']}
      type={type}
    >
      {label}
    </AntButton>
  )
}

export default Button
