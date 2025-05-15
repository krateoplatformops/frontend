import { BellFilled } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, Drawer, Skeleton } from 'antd'
import { useMemo, useState } from 'react'

import { useConfigContext } from '../../context/ConfigContext'

import styles from './Notifications.module.css'

// TODO: this should be completed

export type NotificationType = {
  createdAt: string
  description: string
  id: string
  metadata: {
    name: string
    uid: string
  }
  message: string
  title: string
}

const Notifications = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const { config } = useConfigContext()
  const eventsApiUrl = `${config!.api.EVENTS_API_BASE_URL}/events`

  const { data: notifications, isLoading } = useQuery({
    enabled: drawerVisible,
    queryFn: async () => {
      const res = await fetch(eventsApiUrl)
      const notificasions = (await res.json()) as NotificationType[]
      return notificasions.reverse()
    },
    queryKey: ['notifications', eventsApiUrl],
  })

  const count = 0

  const button = useMemo(
    () => (
      <Badge
        className={`${styles.badge} ${count > 0 ? styles.hasNotifications : ''}`}
        count={count}
      >
        <Button
          className={styles.icon}
          icon={<BellFilled />}
          onClick={() => setDrawerVisible(true)}
          shape='circle'
          type='link'
        />
      </Badge>
    ),
    [count],
  )

  const drawer = (
    <Drawer
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      title='Notifications'
      width={550}
    >
      {isLoading && <Skeleton active />}
      {notifications?.map(({ message, metadata: { name, uid } }) => (
        <div key={uid} style={{ marginBottom: 24 }}>
          <h3>{name}</h3>
          <p>{uid}</p>
          <p>{message}</p>
        </div>
      ))}
    </Drawer>
  )

  return (
    <>
      {button}
      {drawer}
    </>
  )
}

export default Notifications
