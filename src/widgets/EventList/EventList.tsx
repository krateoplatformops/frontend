import { LoadingOutlined } from '@ant-design/icons'
import { Divider, Empty, Spin, Typography } from 'antd'
import { useMemo } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import RichRow from '../../components/RichRow'
import { useGetEvents } from '../../hooks/useGetEvents'
import type { WidgetProps } from '../../types/Widget'
import type { EventsApiResource } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import styles from './EventList.module.css'
import type { EventList as WidgetType } from './EventList.type'

export type EventListWidgetData = WidgetType['spec']['widgetData']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEventsApiResource(value: unknown): value is EventsApiResource {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.global_uid === 'string'
    && typeof value.created_at === 'string'
    && typeof value.event_type === 'string'
    && typeof value.message === 'string'
    && typeof value.namespace === 'string'
    && typeof value.reason === 'string'
    && typeof value.resource_kind === 'string'
    && typeof value.resource_name === 'string'
  )
}

function normalizeEvents(value: unknown): EventsApiResource[] {
  if (!Array.isArray(value)) {
    return []
  }

  const result: EventsApiResource[] = []

  for (const item of value) {
    if (isEventsApiResource(item)) {
      result.push(item)
    }
  }

  return result
}

function mergeUniqueEvents(...lists: EventsApiResource[][]): EventsApiResource[] {
  const seen = new Set<string>()
  const merged: EventsApiResource[] = []

  for (const list of lists) {
    for (const item of list) {
      if (seen.has(item.global_uid)) {
        continue
      }

      seen.add(item.global_uid)
      merged.push(item)
    }
  }

  return merged
}

const EventList = ({ uid, widgetData }: WidgetProps<EventListWidgetData>) => {
  const { events, prefix, sseEndpoint, sseTopic } = widgetData

  const isStatic = useMemo(() => !(!!sseEndpoint && !!sseTopic), [sseEndpoint, sseTopic])

  const { getFilteredData } = useFilter()

  const {
    data: eventList = [],
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useGetEvents({
    enabled: !isStatic,
    registerToSSE: !isStatic,
    sseEndpoint,
    topic: sseTopic,
  })

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget

    const nearBottom = scrollHeight - scrollTop - clientHeight < 120

    if (nearBottom && hasNextPage) {
      fetchNextPage().catch(error => console.error(error))
    }
  }

  const staticEvents = useMemo(() => normalizeEvents(events), [events])
  const liveEvents = useMemo(() => normalizeEvents(eventList), [eventList])

  const eventsSource = useMemo<EventsApiResource[]>(() => {
    if (isStatic) {
      return staticEvents
    }

    return mergeUniqueEvents(liveEvents, staticEvents)
  }, [isStatic, liveEvents, staticEvents])

  const filteredEventList = useMemo<EventsApiResource[]>(() => {
    if (!prefix) {
      return eventsSource
    }

    return normalizeEvents(getFilteredData(eventsSource, prefix))
  }, [eventsSource, prefix, getFilteredData])

  if (isLoading) {
    return <Spin indicator={<LoadingOutlined />} size='large' spinning />
  }

  if (!filteredEventList.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div className={styles.container} onScroll={handleScroll}>
      {filteredEventList.map(
        ({
          created_at: creationTimestamp,
          event_type: type,
          global_uid: rowUid,
          message,
          namespace,
          reason,
          resource_kind: kind,
          resource_name: name,
        }) => (
          <RichRow
            color={type === 'Normal' ? 'blue' : 'orange'}
            icon={'fa-ellipsis-h'}
            key={`${uid}-${rowUid}`}
            primaryText={
              <>
                <Typography.Text type='secondary'>name:</Typography.Text> <Typography.Text>{name}</Typography.Text>
                <Divider type='vertical' />
                <Typography.Text type='secondary'>namespace:</Typography.Text> <Typography.Text>{namespace}</Typography.Text>
                <Divider type='vertical' />
                <Typography.Text type='secondary'>kind:</Typography.Text> <Typography.Text>{kind}</Typography.Text>
              </>
            }
            secondaryText={creationTimestamp && formatISODate(creationTimestamp, true)}
            subPrimaryText={message}
            subSecondaryText={reason}
          />
        )
      )}
      {!isStatic && hasNextPage && (
        <div className={styles.loading}>
          <Spin indicator={<LoadingOutlined />} spinning />
        </div>
      )}
    </div>
  )
}

export default EventList
