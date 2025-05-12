import { BellFilled } from '@ant-design/icons'
import { Badge, Button, Drawer, Skeleton } from 'antd'
import { useMemo, useState } from 'react'

import styles from './Notifications.module.css'

// TODO: handle actual notifications and events
// understand if Redux is still needed
// render notifications

const Notifications = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const count = 0

  const button = useMemo(() => (
    <Badge
      className={`${styles.badge} ${count > 0 ? styles.hasNotifications : ''}`}
      count={count}
      //  count={notifications.length}
    >
      <Button
        className={styles.icon}
        icon={<BellFilled />}
        onClick={() => setDrawerVisible(true)}
        shape='circle'
        type='link'
      />
    </Badge>
  ), [count])

  const drawer = useMemo(() => (
    <Drawer
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      title='Notifications'
      width={550}
    >
      <Skeleton />
    </Drawer>
  ), [drawerVisible])

  return (
    <>
      {button}
      {drawer}
    </>

  )
}

export default Notifications
