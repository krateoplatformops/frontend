import { QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'
import { useLocation, useNavigate } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'
import { getEndpointUrl } from '../../utils/utils'
import { openDrawer } from '../Drawer/Drawer'

import styles from './Panel.module.css'
import type { Panel as WidgetType } from './Panel.type'

export type PanelWidgetData = WidgetType['spec']['widgetData']

const Panel = ({ actions, resourcesRefs, uid, widgetData }: WidgetProps<PanelWidgetData>) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { clickActionId, footer, icon, items, title, tooltip } = widgetData

  const action = Object.values(actions ?? {})
    .flat()
    .find(({ id }) => id === clickActionId)

  const onClick = async () => {
    if (action) {
      const { requireConfirmation, type } = action

      switch (type) {
        case 'navigate': {
          const url = title && `${location.pathname}/${encodeURIComponent(title)}?widgetEndpoint=${encodeURIComponent(getEndpointUrl(action.resourceRefId, resourcesRefs))}`

          if (!url) {
            console.warn('No url found for action', action)
            return
          }

          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              await navigate(url)
            }
          } else {
            await navigate(url)
          }
          break
        }
        case 'openDrawer': {
          const { size, title } = action
          const widgetEndpoint = getEndpointUrl(action.resourceRefId, resourcesRefs)
          openDrawer({ size, title, widgetEndpoint })
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

  return (
    <AntdCard
      className={`${styles.panel} ${action ? styles.clickable : ''}`}
      classNames={{ header: styles.header, title: styles.title }}
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
        <div className={styles.body}>
          {items.map(({ resourceRefId }, index) => (
            <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
          ))}
        </div>
        {footer && (
          <div className={`${styles.footer} ${!footer.tags && footer.items.length === 1 ? styles.single : ''} `}>
            {footer.tags?.map((tag, index) => <Tag key={`tag-${index}`}>{tag}</Tag>)}
            {footer.items.map(({ resourceRefId }, index) => (
              <WidgetRenderer key={`${uid}-footer-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
            ))}
          </div>
        )}
      </div>
    </AntdCard>
  )
}

export default Panel
