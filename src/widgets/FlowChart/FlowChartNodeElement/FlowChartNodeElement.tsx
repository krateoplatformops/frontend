import { LoadingOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Flex, Space, Spin, theme, Tooltip } from 'antd'
import { Handle, Position } from 'reactflow'

import { formatISODate } from '../../../utils/utils'
import type { NodeElementData } from '../types'
import { getDaysPeriod, getNormalizedLabel } from '../utils'

import styles from './FlowChartNodeElement.module.css'

const TagDateFlow = ({ date }: { date: string }) => {
  return (
    <Tooltip title={formatISODate(date, true)}>
      <div className={styles.tagFlow}>
        {getDaysPeriod(date)}
      </div>
    </Tooltip>
  )
}

const TagVersionFlow = ({ version }: { version: string }) => {
  return (
    <div className={styles.tagFlow}>
      {version}
    </div>
  )
}

const FlowChartNodeElement = ({ data }: { data: NodeElementData }) => {
  const { useToken } = theme
  const { token } = useToken()

  const { date, health, icon, kind, name, namespace, status, version } = data

  const statusDisplayer = [
    { color: token.colorSuccessBg, icon: 'fa-check', label: 'Available' },
    { color: token.colorSuccessBg, icon: 'fa-check', label: 'Healthy' },
    { color: token.colorError, icon: 'fa-xmark', label: 'Degraded' },
    { color: token.colorInfo, icon: 'fa-ellipsis', label: 'Progressing' },
    { color: token.colorWarning, icon: 'fa-pause', label: 'Suspended' },
    { color: token.colorBorder, icon: 'fa-link-slash', label: 'Missing' },
    { color: token.colorBorder, icon: 'fa-question', label: 'Unknown' },
    { color: token.colorError, icon: 'fa-rotate', label: 'OutOfSync' },
    { color: token.colorSuccessBg, icon: 'fa-rotate', label: 'Synced' },
  ]

  const getStatusIcon = (label: string | boolean, message?: string) => {
    const normalizedLabel = getNormalizedLabel(label)

    const statusItem = statusDisplayer.find(({ label }) => label === normalizedLabel)
    const icon = statusItem?.icon
    const color = statusItem?.color

    const statusIcon = (
      <Avatar
        icon={<FontAwesomeIcon icon={icon as IconProp} />}
        style={{
          backgroundColor: color,
          border: `solid 4px ${token.colorWhite}`,
          color: token.colorWhite,
        }}
      />
    )

    return message ? <Tooltip title={message}><div>{statusIcon}</div></Tooltip> : statusIcon
  }

  const getNodeIcon = (icon: string, statusLabel: string) => {
    let color: string

    if (['Degraded', 'Progressing', 'Missing'].includes(statusLabel)) {
      color = statusDisplayer.find(({ label }) => label === statusLabel)?.color || token.colorLink
    } else if (statusLabel === 'Unknown') {
      color = token.colorWhite
    } else {
      color = token.colorLink
    }

    const nodeIcon = (
      <Avatar
        icon={<FontAwesomeIcon icon={icon as IconProp} />}
        size={40}
        style={{ backgroundColor: token.colorBorder, color }}
      />
    )

    if (statusLabel === 'Progressing') {
      const spinColor = statusDisplayer.find(({ label }) => label === statusLabel)?.color || color
      return (
        <div className={styles.nodeIconProgressing}>
          {nodeIcon}
          <Spin
            className={styles.nodeIconSpinner}
            indicator={<LoadingOutlined spin style={{ color: spinColor, fontSize: 40 }} />}
          />
        </div>
      )
    }

    return nodeIcon
  }

  return (
    <div className={styles.node}>
      <Handle position={Position.Left} type='target' />
      <Space>
        {icon && health?.status && getNodeIcon(icon, health.status)}
        <div>
          <div className={styles.header}>
            {name}
          </div>
          { namespace && <div className={styles.subHeader}>NS: {namespace}</div> }
          <div className={styles.body}>
            {kind}
          </div>
          <Flex align='center' className={styles.footer} gap={5}>
            {health?.status && getStatusIcon(health.status, health.message)}
            {status && statusDisplayer && getStatusIcon(status, status === 'Synced' ? 'Synced' : 'Out of Sync')}
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
