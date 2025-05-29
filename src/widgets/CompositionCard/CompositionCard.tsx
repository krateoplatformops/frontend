import { QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import styles from './CompositionCard.module.css'
import type { CompositionCard as WidgetType } from './CompositionCard.type'

export type CompositionCardWidgetData = WidgetType['spec']['widgetData']

const CompositionCard = ({ uid, widgetData }: WidgetProps<CompositionCardWidgetData>) => {
  const { date, description, icon, status, tags, title, tooltip } = widgetData

  // const action = Object.values(actions ?? {})
  //   .flat()
  //   .find(({ id }) => id === clickActionId)

  // const onClick = async () => {
  //   if (action) {
  //     const { requireConfirmation, type } = action

  //     switch (type) {
  //       case 'navigate': {
  //         if (requireConfirmation) {
  //           if (window.confirm('Are you sure?')) {
  //             const url = getEndpointUrl(action.resourceRefId, resourcesRefs)
  //             await navigate(url)
  //           }
  //         }
  //         break
  //       }
  //       default:
  //         throw new Error(`Unsupported action type}`)
  //     }
  //   } else {
  //     // TODO: remove this
  //     const url = `${window.location.pathname}/${encodeURIComponent(title)}?widgetEndpoint=${encodeURIComponent(getEndpointUrl('my-tab-list', resourcesRefs))}`
  //     void navigate(url)
  //     throw new Error(`Actions with id ${clickActionId} not found`)
  //   }
  // }

  // const handleClick = () => {
  //   onClick()
  //     .catch((error) => {
  //       console.error('Error in composition card click handler:', error)
  //     })
  // }

  return (
    <AntdCard
      // className={`${styles.compositionCard} ${action ? styles.clickable : ''}`}
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
          {status}
          {date}
          {description}
          {<Tag className={styles.tag}>{tags?.join(', ')}</Tag>}
        </div>
        <div className={`${styles.footer}`}>
          <Button />
        </div>
      </div>
    </AntdCard>
  )
}

export default CompositionCard
