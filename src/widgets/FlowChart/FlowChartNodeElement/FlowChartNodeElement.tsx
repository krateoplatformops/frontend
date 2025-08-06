import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Flex, Space, Tooltip } from 'antd'
import { Handle, Position } from 'reactflow'

import { formatISODate } from '../../../utils/utils'
import type { NodeElementData } from '../types'
import { getDaysPeriod } from '../utils'

import styles from './FlowChartNodeElement.module.css'

const TagDateFlow = ({ date }: { date: string }) => (
  <Tooltip title={formatISODate(date, true)}>
    <div className={styles.tagFlow}>{getDaysPeriod(date)}</div>
  </Tooltip>
)

const TagVersionFlow = ({ version }: { version: string }) => (
  <div className={styles.tagFlow}>{version}</div>
)

const renderIcon = (icon: { name: string; color: string; message?: string }, size: number = 40) => {
  const { color, message, name } = icon

  const avatar = (
    <Avatar
      icon={<FontAwesomeIcon icon={name as IconProp} />}
      size={size}
      style={{ backgroundColor: color, color: 'white' }}
    />
  )

  return message
    ? <Tooltip title={message}><div>{avatar}</div></Tooltip>
    : avatar
}

const fallbackIcon = { color: '#fff', name: 'fa-question' }

const FlowChartNodeElement = ({ data }: { data: NodeElementData }) => {
  const { date, icon, kind, name, namespace, statusIcon, version } = data

  return (
    <div className={styles.node}>
      <Handle position={Position.Left} type='target' />
      <Space>
        {renderIcon(icon || fallbackIcon)}
        <div>
          <div className={styles.header}>{name}</div>
          {namespace && <div className={styles.subHeader}>NS: {namespace}</div>}
          <div className={styles.body}>{kind}</div>
          <Flex align='center' className={styles.footer} gap={5}>
            {renderIcon(statusIcon || fallbackIcon, 32)}
            <TagDateFlow date={date} />
            <TagVersionFlow version={version} />
          </Flex>
        </div>
      </Space>
      <Handle position={Position.Right} type='source' />
    </div>
  )
}

export default FlowChartNodeElement
