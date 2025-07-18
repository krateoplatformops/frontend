import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntdButton, Result } from 'antd'

import { useConfigContext } from '../../context/ConfigContext'
import { useHandleAction } from '../../hooks/useHandleActions'
import type { WidgetProps } from '../../types/Widget'
import { getResourceRef } from '../../utils/utils'

import styles from './Button.module.css'
import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const Button = ({ resourcesRefs, uid, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { actions, clickActionId, color, icon, label, shape, size, type } = widgetData

  const { config } = useConfigContext()
  const { handleAction, isActionLoading } = useHandleAction()

  const action = Object.values(actions)
    .flat()
    .find(({ id }) => id === clickActionId)

  if (!action) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget definition does not include an action (ID: ${clickActionId})`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

  if (!resourceRef) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget definition does not include a resource reference for resource (ID: ${action.resourceRefId})`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const onClick = async () => {
    const { path } = resourceRef

    const url = action.type === 'rest' ? config?.api.SNOWPLOW_API_BASE_URL + path : path
    await handleAction(action, url)
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
        loading={isActionLoading}
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
