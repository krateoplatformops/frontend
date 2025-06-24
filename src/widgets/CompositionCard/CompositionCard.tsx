import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card as AntdCard, Avatar, Button, Tag, Tooltip } from 'antd'
import { useLocation, useNavigate } from 'react-router'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'
import { getEndpointUrl } from '../../utils/utils'

import styles from './CompositionCard.module.css'
import type { CompositionCard as WidgetType } from './CompositionCard.type'

export type CompositionCardWidgetData = WidgetType['spec']['widgetData']

const CompositionCard = ({ resourcesRefs, uid, widgetData }: WidgetProps<CompositionCardWidgetData>) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { actions, date, description, icon, navigateToDetailActionId, status, tags, title, tooltip } = widgetData

  const clickAction = Object.values(actions ?? {})
    .flat()
    .find(({ id }) => id === navigateToDetailActionId)

  const onClick = async () => {
    if (clickAction) {
      const { requireConfirmation, type } = clickAction

      switch (type) {
        case 'navigate': {
          const url = title && `${location.pathname}/${encodeURIComponent(title)}?widgetEndpoint=${encodeURIComponent(getEndpointUrl(clickAction.resourceRefId, resourcesRefs))}`

          if (!url) { return }

          if (requireConfirmation) {
            if (window.confirm('Are you sure?')) {
              await navigate(url)
            }
          } else {
            await navigate(url)
          }
          break
        }
        default:
          throw new Error(`Unsupported action type}`)
      }
    } else {
      throw new Error(`Actions with id ${navigateToDetailActionId} not found`)
    }
  }

  const handleClick = () => {
    onClick()
      .catch((error) => {
        console.error('Error in composition card click handler:', error)
      })
  }

  return (
    <AntdCard
      className={`${styles.compositionCard} ${clickAction ? styles.clickable : ''}`}
      classNames={{ body: styles.bodyWrapper, header: styles.header, title: styles.title }}
      extra={tooltip && (
        <Tooltip title={tooltip}>
          <Button icon={<QuestionCircleOutlined />} type='text' />
        </Tooltip>
      )}
      key={uid}
      onClick={handleClick}
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
          <div className={styles.info}>
            <span>{status}</span>
            <span>{date}</span>
          </div>
          {description}
        </div>
        <div className={styles.footer}>
          <div>
            {tags?.map((tag, index) => <Tag key={`tag-${index}`}>{tag}</Tag>)}
          </div>
          <Button
            icon={<DeleteOutlined />}
            onClick={(event) => event.stopPropagation()}
            shape='circle'
          />
        </div>
      </div>
    </AntdCard>
  )
}

export default CompositionCard
