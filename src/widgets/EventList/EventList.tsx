import { Divider, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import RichRow from '../../components/RichRow'
import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import type { SSEK8sEvent } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import type { EventList as WidgetType } from './EventList.type'

export type EventListWidgetData = WidgetType['spec']['widgetData']

const EventList = ({ uid, widgetData }: WidgetProps<EventListWidgetData>) => {
  const { events, prefix, sseEndpoint, sseTopic } = widgetData

  const { config } = useConfigContext()
  const { getFilteredData } = useFilter()

  const [eventList, setEventList] = useState<SSEK8sEvent[]>(events || [])

  useEffect(() => {
    if (sseEndpoint && sseTopic) {
      const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}${sseEndpoint.endsWith('/') ? sseEndpoint.slice(0, -1) : sseEndpoint}`
      const eventSource = new EventSource(eventsEndpoint, {
        withCredentials: false,
      })

      eventSource.addEventListener(sseTopic, (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as SSEK8sEvent
          setEventList((prev) => [data, ...prev].slice(0, 200)) /* limit to 200 events to prevent memory leak */
        } catch (error) {
          console.error('Error parsing event data:', error)
        }
      })

      return () => eventSource.close()
    }
  }, [config, sseEndpoint, sseTopic])

  const filteredEventList = useMemo(() => {
    if (prefix && eventList.length > 0) {
      return getFilteredData(eventList, prefix) as SSEK8sEvent[]
    }

    return eventList
  }, [prefix, eventList, getFilteredData])

  return (
    <>
      {filteredEventList.map(
        ({
          eventTime,
          firstTimestamp,
          icon,
          involvedObject: { apiVersion, kind, name, namespace },
          lastTimestamp,
          message,
          metadata: { uid: rowUid },
          reason,
          type,
        }) => {
          const timestamp = lastTimestamp || firstTimestamp || eventTime

          return (
            <RichRow
              color={type === 'Normal' ? 'blue' : 'orange'}
              icon={icon || 'fa-ellipsis-h'}
              key={`${uid}-${rowUid}`}
              primaryText={
                <>
                  <Typography.Text type='secondary'>name:</Typography.Text> <Typography.Text>{name}</Typography.Text>
                  <Divider type='vertical' />
                  <Typography.Text type='secondary'>namespace:</Typography.Text> <Typography.Text>{namespace}</Typography.Text>
                  <Divider type='vertical' />
                  <Typography.Text type='secondary'>kind:</Typography.Text> <Typography.Text>{kind}</Typography.Text>
                  <Divider type='vertical' />
                  <Typography.Text type='secondary'>apiVersion:</Typography.Text> <Typography.Text>{apiVersion}</Typography.Text>
                </>
              }
              secondaryText={timestamp && formatISODate(timestamp, true)}
              subPrimaryText={message}
              subSecondaryText={reason}
            />
          )
        }
      )}
    </>
  )
}

export default EventList
