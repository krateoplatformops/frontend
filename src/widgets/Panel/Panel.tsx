import { QuestionCircleOutlined } from '@ant-design/icons'
import { Card as AntdCard, Button, Tooltip } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Panel.module.css'
import type { Panel as WidgetType } from './Panel.type'

type WidgetData = WidgetType['spec']['widgetData']

const Panel = ({ resourcesRefs, widgetData }: WidgetProps<WidgetData>) => {
  const { footer, items, title, tooltip } = widgetData

  return (
    <AntdCard
      className={styles.panel}
      classNames={{ header: styles.header, title: styles.title }}
      extra={tooltip && (
        <Tooltip title={tooltip}>
          <Button icon={<QuestionCircleOutlined />} type='text' />
        </Tooltip>
      )}
      title={title}
      variant={'borderless'}
    >
      <div className={styles.content}>
        <div className={styles.body}>
          {items.map(({ resourceRefId }) => (
            <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
          ))}
        </div>
        {footer && (
          <div className={styles.footer}>
            {footer.map(({ resourceRefId }) => (
              <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
            ))}
          </div>
        )}
      </div>
    </AntdCard>
  )
}

export default Panel
