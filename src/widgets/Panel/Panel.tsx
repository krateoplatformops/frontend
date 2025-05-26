import { QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Panel.module.css'
import type { Panel as WidgetType } from './Panel.type'

export type PanelWidgetData = WidgetType['spec']['widgetData']

const Panel = ({ resourcesRefs, uid, widgetData }: WidgetProps<PanelWidgetData>) => {
  const { footer, icon, items, title, tooltip } = widgetData

  return (
    <AntdCard
      className={styles.panel}
      classNames={{ header: styles.header, title: styles.title }}
      extra={tooltip && (
        <Tooltip title={tooltip}>
          <Button icon={<QuestionCircleOutlined />} type='text' />
        </Tooltip>
      )}
      key={uid}
      title={(
        <div className={styles.title}>
          {icon && (
            <Avatar
              icon={<FontAwesomeIcon icon={icon.name as IconProp} />}
              size={64}
              style={{ backgroundColor: getColorCode(icon.color) }}
            />
          )}
          {title}
        </div>
      )}
      variant={'borderless'}
    >
      <div className={styles.content}>
        <div className={styles.body}>
          {items.map(({ resourceRefId }, index) => (
            <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
          ))}
        </div>
        {footer && (
          <div className={`${styles.footer} ${(!footer.tag && footer.items.length === 1) ? styles.single : ''} `}>
            {footer.tag && <Tag>{footer.tag}</Tag> }
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
