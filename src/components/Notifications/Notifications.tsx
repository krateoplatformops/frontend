import { BellFilled, LoadingOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Drawer, List, Skeleton, Spin, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useGetEvents } from '../../hooks/useGetEvents'
import { formatISODate } from '../../utils/utils'

import styles from './Notifications.module.css'

const Notifications = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const queryClient = useQueryClient()

  const {
    data: notifications = [],
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetEvents({
    enabled: drawerVisible,
    registerToSSE: drawerVisible,
    topic: 'krateo',
  })

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget

    const nearBottom = scrollHeight - scrollTop - clientHeight < 120

    if (nearBottom && hasNextPage) {
      fetchNextPage().catch(console.error)
    }
  }, [fetchNextPage, hasNextPage])

  useEffect(() => {
    if (drawerVisible) {
      queryClient.setQueryData(['events-unread', 'krateo', undefined], 0)
    }
  }, [drawerVisible, queryClient])

  const notificationList = useMemo(() => (
    <div className={styles.container} onScroll={handleScroll}>
      <List
        className={styles.list}
        dataSource={notifications}
        itemLayout='vertical'
        renderItem={({
          created_at: creationTimestamp,
          event_type: type,
          global_uid: uid,
          message,
          namespace,
          reason,
          resource_kind: kind,
          resource_name: name,
        }, index) => {
          return (
            <List.Item
              className={`${styles.listItem} ${index === 0 ? styles.firstElement : ''} ${notifications?.length && index === notifications.length - 1 ? styles.lastElement : ''}`}
              key={uid}
            >
              <Button className={styles.notificationElement} type='link'>
                <div className={styles.space}>
                  <div className={styles.titleWrapper}>
                    <Badge
                      color={type === 'Normal' ? '#11B2E2' : '#ffaa00'}
                      text={
                        <Typography.Text className={styles.title} strong>
                          {reason}
                        </Typography.Text>
                      }
                    />
                    <Typography.Paragraph className={styles.timestamp}>
                      {creationTimestamp && formatISODate(creationTimestamp, true)}
                    </Typography.Paragraph>
                  </div>
                  <Typography.Text className={styles.description}>
                    {message}
                  </Typography.Text>
                  <Typography.Paragraph className={styles.details}>
                    {`${kind}/${namespace}/${name}`}
                  </Typography.Paragraph>
                </div>
              </Button>
            </List.Item>
          )
        }}
        size='large'
      />
      {hasNextPage && (
        <div className={styles.loading}>
          <Spin indicator={<LoadingOutlined />} spinning />
        </div>
      )}
    </div>
  ), [handleScroll, hasNextPage, notifications])

  return (
    <>
      <Button
        className={styles.icon}
        icon={<BellFilled />}
        onClick={() => setDrawerVisible(true)}
        shape='circle'
        type='link'
      />

      <Drawer
        className={styles.drawer}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        title='Notifications'
        width={550}
      >
        {isLoading ? <Skeleton active /> : notificationList}
      </Drawer>
    </>
  )
}

export default Notifications
