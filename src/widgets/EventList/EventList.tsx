import { Divider, Typography } from 'antd'
import { useEffect, useState } from 'react'

import RichRow from '../../components/RichRow'
import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { formatISODate } from '../../utils/utils'

interface SSEEvent {
  metadata: {
    uid: string
    creationTimestamp: string
  }
  reason: string
  icon: string
  type: 'Normal'
  message: string
  involvedObject: {
    name: string
    namespace: string
    kind: string
    apiVersion: string
  }
}

const EventList = ({ widgetData }: WidgetProps<{
  events: SSEEvent[]
  sseEndpoint?: string
  sseTopic?: string
}>) => {
  const { events, sseEndpoint, sseTopic } = widgetData

  const { config } = useConfigContext()

  const [eventList, setEventList] = useState<SSEEvent[]>(events || [])

  useEffect(() => {
    if (sseEndpoint && sseTopic) {
      const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}${sseEndpoint.endsWith('/') ? sseEndpoint.slice(0, -1) : sseEndpoint}`
      const eventSource = new EventSource(eventsEndpoint, {
        withCredentials: false,
      })

      eventSource.addEventListener(sseTopic, (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as SSEEvent[]
        setEventList(prev => [...data, ...prev])
      })

      return () => eventSource.close()
    }
  }, [config, eventList, sseEndpoint, sseTopic])

  return (
    <>
      {eventList.map(({
        icon,
        message,
        involvedObject: { apiVersion, kind, name, namespace },
        metadata: { creationTimestamp, uid },
        reason,
        type,
      }) => (
        <RichRow
          color={type === 'Normal' ? 'blue' : 'orange'}
          icon={icon}
          key={uid}
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
          secondaryText={formatISODate(creationTimestamp, true)}
          subPrimaryText={message}
          subSecondaryText={reason}
        />
      ))}
    </>
  )
}

export default EventList
