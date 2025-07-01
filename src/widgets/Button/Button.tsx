import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryClient } from '@tanstack/react-query'
import { Button as AntdButton, Result } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import type { RestApiResponse } from '../../utils/types'
import { getResourceRef } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'
import { openModal } from '../Modal/Modal'

import styles from './Button.module.css'
import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const Button = ({ resourcesRefs, uid, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { actions, clickActionId, color, icon, label, shape, size, type } = widgetData

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { config } = useConfigContext()
  const { notification } = useApp()

  const action = Object.values(actions)
    .flat()
    .find(({ id }) => id === clickActionId)

  if (!action) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget definition does not include an action with the ID ${clickActionId}`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

  if (!resourceRef) { return null }

  const { path, verb } = resourceRef

  const onClick = async () => {
    if (action) {
      const { requireConfirmation, type } = action

      switch (type) {
        case 'navigate': {
          if (requireConfirmation && window.confirm('Are you sure?')) {
            await navigate(path)
          }
          break
        }
        case 'rest': {
          const { errorMessage, id, onSuccessNavigateTo, payload, successMessage } = action

          if (requireConfirmation) {
            const confirmed = window.confirm('Are you sure?')
            if (!confirmed) {
              break
            }
          }

          const url = config?.api.SNOWPLOW_API_BASE_URL + path

          if (verb === 'POST' && !payload) {
            console.warn(`Payload not found for POST action ${id}`)
          }

          const res = await fetch(url, {
            body: JSON.stringify(payload),
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
            method: verb,
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

          const actionName = verb === 'DELETE' ? 'deleted' : 'created'
          notification.success({
            description: successMessage || `Successfully ${actionName} ${json.metadata?.name} in ${json.metadata?.namespace}`,
            message: json.message,
            placement: 'bottomLeft',
          })

          await queryClient.invalidateQueries()
          if (onSuccessNavigateTo) {
            void navigate(onSuccessNavigateTo)
          }

          break
        }
        case 'openDrawer': {
          const { size, title } = action
          openDrawer({ size, title, widgetEndpoint: path })

          break
        }
        case 'openModal': {
          const { title } = action
          openModal({ title, widgetEndpoint: path })

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
