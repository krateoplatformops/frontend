import { BellFilled, LoadingOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Badge, Button, Drawer, List, Skeleton, Spin, Typography } from 'antd'
import VirtualList from 'rc-virtual-list'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useGetEvents } from '../../hooks/useGetEvents'
import type { EventsApiResource } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import styles from './Notifications.module.css'

type LoaderItem = {
  __isLoader: true
  __loaderId: string
}

type NotificationItem = EventsApiResource | LoaderItem

const Notifications: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [listHeight, setListHeight] = useState<number>(0)

  const {
    data: notifications = [],
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetEvents({
    enabled: drawerVisible,
    registerToSSE: drawerVisible,
    topic: 'k8s-event',
  })

  const virtualData: NotificationItem[] = useMemo(() => {
    if (hasNextPage) {
      return [
        ...notifications,
        { __isLoader: true, __loaderId: '__loader__' },
      ] as NotificationItem[]
    }

    return notifications as NotificationItem[]
  }, [notifications, hasNextPage])

  const handleVirtualScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const target = event.currentTarget
    const { clientHeight, scrollHeight, scrollTop } = target

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

  useLayoutEffect(() => {
    if (!drawerVisible) {
      setListHeight(0)
      return
    }

    const drawerBody = document.querySelector('.ant-drawer-body')

    if (drawerBody) {
      const bodyHeight = drawerBody.clientHeight
      setListHeight(bodyHeight)
      return
    }

    setListHeight(window.innerHeight - 120)
  }, [drawerVisible])

  const renderVirtualItem = useCallback((item: NotificationItem, index: number) => {
    if ('__isLoader' in item && item.__isLoader) {
      return (
        <div className={styles.loading} key={item.__loaderId}>
          <Spin indicator={<LoadingOutlined />} spinning />
        </div>
      )
    }

    const {
      created_at: creationTimestamp,
      event_type: type,
      global_uid: uid,
      message,
      namespace,
      reason,
      resource_kind: kind,
      resource_name: name,
    } = item as EventsApiResource

    const isFirst = index === 0
    const isLast = notifications?.length && index === notifications.length - 1

    return (
      <List.Item
        className={`${styles.listItem} ${isFirst ? styles.firstElement : ''} ${notifications?.length && isLast ? styles.lastElement : ''}`}
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
  }, [notifications])

  const notificationList = useMemo(() => (
    <div className={styles.container} ref={containerRef}>
      {listHeight > 0 && (
        <List className={styles.list} size='large'>
          <VirtualList
            data={virtualData}
            height={listHeight - 48}
            itemHeight={90}
            itemKey={(item: NotificationItem) => {
              if ('__isLoader' in item && item.__isLoader) { return item.__loaderId }
              return (item as EventsApiResource).global_uid
            }}
            onScroll={handleVirtualScroll}
          >
            {(item: NotificationItem, index: number) => renderVirtualItem(item, index)}
          </VirtualList>
        </List>
      )}
    </div>
  ), [handleVirtualScroll, listHeight, renderVirtualItem, virtualData])

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
