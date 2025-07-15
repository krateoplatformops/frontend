import { QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useLocation } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import { useHandleAction } from '../../hooks/useHandleActions'
import type { WidgetAction, WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'
import { getEndpointUrl, getResourceRef } from '../../utils/utils'

import styles from './Panel.module.css'
import type { Panel as WidgetType } from './Panel.type'

export type PanelWidgetData = WidgetType['spec']['widgetData']

const Panel = ({ resourcesRefs, uid, widgetData }: WidgetProps<PanelWidgetData>) => {
  const location = useLocation()
  const { notification } = useApp()
  const { handleAction } = useHandleAction()

  const { actions, clickActionId, footer, headerLeft, headerRight, icon, items, tags, title, tooltip } = widgetData

  const action: WidgetAction | undefined = Object.values(actions ?? {})
    .flat()
    .find(({ id }) => id === clickActionId)

  const onClick = async () => {
    if (!action) {
      notification.error({
        description: `The widget definition does not include an action (ID: ${clickActionId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

    if (!resourceRef) {
      notification.error({
        description: `The widget definition does not include a resource reference for resource (ID: ${action.resourceRefId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    const url = action.type === 'navigate' && title
      ? `${location.pathname}/${encodeURIComponent(title)}?widgetEndpoint=${encodeURIComponent(resourceRef.path)}`
      : resourceRef.path || null

    if (!url) {
      notification.warning({
        description: `It is not possible to retrieve a valid URL for the resource ${action.resourceRefId}`,
        message: 'Error while navigating',
        placement: 'bottomLeft',
      })

      return
    }

    await handleAction(action, url)
  }

  const handleClick = () => {
    onClick().catch((error) => {
      console.error('Error in panel click handler:', error)
    })
  }

  const panelHeader = (
    <div className={`${styles.bodyHeader} ${!headerLeft && headerRight ? styles.right : ''}`}>
      <div>{headerLeft}</div>
      <div>{headerRight}</div>
    </div>
  )

  const panelFooter = (
    <div className={`${styles.footer} ${!tags && footer?.length === 1 ? styles.single : ''} `}>
      {tags && tags.length > 0 && (
        <div>
          {tags?.map((tag, index) => <Tag key={`tag-${index}`}>{tag}</Tag>)}
        </div>
      )}
      {footer && footer.length > 0 && (
        <div className={styles.items}>
          {footer
            .map(({ resourceRefId }, index) => {
              const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
              if (!endpoint) { return null }

              return <WidgetRenderer key={`${uid}-footer-${index}`} widgetEndpoint={endpoint} />
            })
            .filter(Boolean)
          }
        </div>
      )}
    </div>
  )

  return (
    <AntdCard
      className={`${styles.panel} ${action ? styles.clickable : ''}`}
      classNames={{ body: styles.bodyWrapper, header: styles.header, title: styles.title }}
      extra={
        tooltip && (
          <Tooltip title={tooltip}>
            <Button icon={<QuestionCircleOutlined />} type='text' />
          </Tooltip>
        )
      }
      key={uid}
      onClick={handleClick}
      title={
        (title || icon) && (
          <div className={styles.title}>
            {icon && <Avatar icon={<FontAwesomeIcon icon={icon.name as IconProp} />} size={64} style={{ backgroundColor: getColorCode(icon.color) }} />}
            {title}
          </div>
        )
      }
      variant={'borderless'}
    >
      <div className={styles.content}>
        {(headerLeft || headerRight) && panelHeader}
        <div className={styles.body}>
          {items
            .map(({ resourceRefId }, index) => {
              const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
              if (!endpoint) { return null }

              return <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={endpoint} />
            })
            .filter(Boolean)
          }
        </div>
        {footer && panelFooter}
      </div>
    </AntdCard>
  )
}

export default Panel
