import { Divider, Typography } from 'antd'
import { useEffect, useState } from 'react'

import RichRow from '../../components/RichRow'
import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import type { SSEK8sEvent } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import type { EventList as WidgetType } from './EventList.type'

export type EventListWidgetData = WidgetType['spec']['widgetData']

const EventList = ({ uid, widgetData }: WidgetProps<EventListWidgetData>) => {
  const { events, sseEndpoint, sseTopic } = widgetData

  const { config } = useConfigContext()

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
  }, [config, eventList, sseEndpoint, sseTopic])

  return (
    <>
      {eventList.map(
        ({
          icon,
          involvedObject: { apiVersion, kind, name, namespace },
          lastTimestamp,
          message,
          metadata: { uid: rowUid },
          reason,
          type,
        }) => (
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
            secondaryText={lastTimestamp && formatISODate(lastTimestamp, true)}
            subPrimaryText={message}
            subSecondaryText={reason}
          />
        )
      )}
    </>
  )
}

export default EventList
