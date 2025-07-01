import { QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'
import { getEndpointUrl } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'
import { openModal } from '../Modal/Modal'

import styles from './Panel.module.css'
import type { Panel as WidgetType } from './Panel.type'

export type PanelWidgetData = WidgetType['spec']['widgetData']

const Panel = ({ resourcesRefs, uid, widgetData }: WidgetProps<PanelWidgetData>) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { notification } = useApp()

  const { actions, clickActionId, footer, headerLeft, headerRight, icon, items, tags, title, tooltip } = widgetData

  const action = Object.values(actions ?? {})
    .flat()
    .find(({ id }) => id === clickActionId)

  const onClick = async () => {
    if (action) {
      const { requireConfirmation, type } = action

      switch (type) {
        case 'navigate': {
          const endpoint = getEndpointUrl(action.resourceRefId, resourcesRefs)

          if (!endpoint) {
            notification.warning({
              description: `It is not possible to retrieve a valid endpoint for the resource ${action.resourceRefId}`,
              message: `Error while navigating`,
              placement: 'bottomLeft',
            })
            break
          }

          const url = title && `${location.pathname}/${encodeURIComponent(title)}?widgetEndpoint=${encodeURIComponent(endpoint)}`

          if (!url) {
            notification.warning({
              description: `It is not possible to retrieve a valid URL for the resource ${action.resourceRefId}`,
              message: `Error while navigating`,
              placement: 'bottomLeft',
            })
          } else if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              await navigate(url)
            }
          } else {
            await navigate(url)
          }
          break
        }
        case 'openDrawer': {
          const { resourceRefId, size, title } = action
          const widgetEndpoint = getEndpointUrl(resourceRefId, resourcesRefs)

          if (!widgetEndpoint) {
            notification.warning({
              description: `It is not possible to retrieve a valid URL for the resource ${action.resourceRefId}`,
              message: `Error while opening drawer`,
              placement: 'bottomLeft',
            })
          } else {
            openDrawer({ size, title, widgetEndpoint })
          }

          break
        }
        case 'openModal': {
          const { resourceRefId, title } = action
          const widgetEndpoint = getEndpointUrl(resourceRefId, resourcesRefs)

          if (!widgetEndpoint) {
            notification.warning({
              description: `It is not possible to retrieve a valid URL for the resource ${action.resourceRefId}`,
              message: `Error while opening modal`,
              placement: 'bottomLeft',
            })
          } else {
            openModal({ title, widgetEndpoint })
          }

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
      console.error('Error in panel click handler:', error)
    })
  }

  const panelHeader = useMemo(() => {
    if (!headerLeft && !headerRight) {
      return <></>
    }

    return (
      <div className={`${styles.bodyHeader} ${!headerLeft && headerRight ? styles.right : ''}`}>
        <div>{headerLeft}</div>
        <div>{headerRight}</div>
      </div>
    )
  }, [headerLeft, headerRight])

  const panelFooter = useMemo(() => {
    if (!footer) {
      return <></>
    }

    return (
      <div className={`${styles.footer} ${!tags && footer?.length === 1 ? styles.single : ''} `}>
        {tags && tags.length > 0 && (
          <div>
            {tags?.map((tag, index) => <Tag key={`tag-${index}`}>{tag}</Tag>)}
          </div>
        )}
        {footer && footer.length > 0 && (
          <div className={styles.items}>
            {footer
              ?.map(({ resourceRefId }, index) => {
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
  }, [footer, resourcesRefs, tags, uid])

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
        {panelHeader}
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
        {panelFooter}
      </div>
    </AntdCard>
  )
}

export default Panel
