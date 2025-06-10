import { BellFilled } from '@ant-design/icons'
import { Badge, Button, Drawer, List, Skeleton, Space, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useGetEvents } from '../../hooks/useGetEvents'
import { formatISODate } from '../../utils/utils'

import styles from './Notifications.module.css'

const Notifications = () => {
  const navigate = useNavigate()

  const [drawerVisible, setDrawerVisible] = useState(false)

  const { data: notifications, isLoading } = useGetEvents({ registerToSSE: true, topic: 'krateo' })

  const onClickNotification = useCallback(
    (url: string | undefined) => {
      if (url && url?.length > 0) {
        void navigate(url)
      }
    },
    [navigate]
  )

  const notificationList = useMemo(() => (
    <List
      className={styles.list}
      dataSource={notifications}
      itemLayout='vertical'
      renderItem={({
        description,
        involvedObject: { apiVersion, kind },
        message,
        metadata: { creationTimestamp, name, namespace, uid },
        reason,
        title,
        type,
        url,
      }) => (
        <List.Item className={styles.listItem} key={uid}>
          <Button className={styles.notificationElement} onClick={() => onClickNotification(url)} type='link'>
            <Space direction='vertical'>
              <Typography.Paragraph className={styles.timestamp}>
                {formatISODate(creationTimestamp, true)}
              </Typography.Paragraph>
              <Badge
                color={type === 'Normal' ? '#11B2E2' : '#ffaa00'}
                text={
                  <Typography.Text className={styles.title} strong>
                    {title || reason}
                  </Typography.Text>
                }
              />
              <Typography.Text className={styles.description}>
                {description || message}
              </Typography.Text>
              <Typography.Paragraph className={styles.details}>
                {`${apiVersion}.${kind}/${name}@${namespace}`}
              </Typography.Paragraph>
            </Space>
          </Button>
        </List.Item>
      )}
      size='large'
    />
  ), [notifications, onClickNotification])

  return (
    <>
      <Badge
        className={`${styles.badge} ${notifications && notifications?.length > 0 ? styles.hasNotifications : ''}`}
        count={notifications?.length || 0}
      >
        <Button className={styles.icon} icon={<BellFilled />} onClick={() => setDrawerVisible(true)} shape='circle' type='link' />
      </Badge>

      <Drawer className={styles.drawer} onClose={() => setDrawerVisible(false)} open={drawerVisible} title='Notifications' width={550}>
        {isLoading ? <Skeleton active /> : notificationList}
      </Drawer>
    </>
  )
}

export default Notifications
