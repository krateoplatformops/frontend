import { BellFilled } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, Drawer, List, Skeleton, Space, Typography } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { SSEK8sEvent } from '../../utils/types'

import styles from './Notifications.module.css'

const Notifications = () => {
  const navigate = useNavigate()

  const [drawerVisible, setDrawerVisible] = useState(false)

  const { config } = useConfigContext()
  const eventsApiUrl = `${config!.api.EVENTS_API_BASE_URL}/events`

  const { data: notifications, isLoading } = useQuery({
    enabled: drawerVisible,
    queryFn: async () => {
      const res = await fetch(eventsApiUrl, { credentials: 'omit' })
      const notifications = (await res.json()) as SSEK8sEvent[]
      return notifications.reverse()
    },
    queryKey: ['notifications', eventsApiUrl],
    refetchInterval: 5000,
  })

  const onClickNotification = useCallback((url: string | undefined) => {
    if (url && url?.length > 0) {
      void navigate(url)
    }
  }, [navigate])

  const notificationList = useMemo(() => (
    <List
      className={styles.list}
      dataSource={notifications}
      itemLayout='vertical'
      renderItem={({
        description,
        involvedObject: { apiVersion, kind },
        message,
        metadata: { name, namespace, uid },
        reason,
        title,
        type,
        url,
      }) => (
        <List.Item className={styles.listItem} key={uid}>
          <Button className={styles.notificationElement} onClick={() => onClickNotification(url)} type='link'>
            <Space direction='vertical'>
              <Badge
                color={type === 'Normal' ? '#11B2E2' : '#ffaa00'}
                text={<Typography.Text className={styles.title} strong>{title || reason}</Typography.Text>}
              />
              <Typography.Text className={styles.description}>{description || message}</Typography.Text>
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
        <Button
          className={styles.icon}
          icon={<BellFilled />}
          onClick={() => setDrawerVisible(true)}
          shape='circle'
          type='link'
        />
      </Badge>

      <Drawer
        className={styles.drawer}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        title='Notifications'
        width={550}
      >
        {isLoading ? <Skeleton active /> : notificationList }
      </Drawer>
    </>
  )
}

export default Notifications
