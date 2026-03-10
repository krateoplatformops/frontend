import { LoadingOutlined } from '@ant-design/icons'
import { Divider, Empty, Spin, Typography } from 'antd'
import { useMemo } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import RichRow from '../../components/RichRow'
import { useGetEvents } from '../../hooks/useGetEvents'
import type { WidgetProps } from '../../types/Widget'
import type { EventsApiResource } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import type { EventList as WidgetType } from './EventList.type'

export type EventListWidgetData = WidgetType['spec']['widgetData']

const EventList = ({ uid, widgetData }: WidgetProps<EventListWidgetData>) => {
  const { events, prefix, sseEndpoint, sseTopic } = widgetData

  const { getFilteredData } = useFilter()

  const { data: eventList = [], isLoading } = useGetEvents({
    enabled: events === undefined,
    registerToSSE: !!sseEndpoint && !!sseTopic,
    sseEndpoint,
    topic: sseTopic,
  })

  const eventsSource = useMemo(() => (events ?? eventList) as EventsApiResource[], [eventList, events])

  const filteredEventList = useMemo(() => {
    if (prefix && eventsSource.length > 0) {
      return getFilteredData(eventsSource, prefix) as EventsApiResource[]
    }

    return eventsSource
  }, [prefix, eventsSource, getFilteredData])

  if (isLoading) {
    return <Spin indicator={<LoadingOutlined />} size='large' spinning />
  }

  if (!filteredEventList.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <>
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
    </>
  )
}

export default EventList
