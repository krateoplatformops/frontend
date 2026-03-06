import { LoadingOutlined } from '@ant-design/icons'
import { Divider, Empty, Spin, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import RichRow from '../../components/RichRow'
import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import type { EventsApiResource } from '../../utils/types'
import { formatISODate } from '../../utils/utils'

import type { EventList as WidgetType } from './EventList.type'

export type EventListWidgetData = WidgetType['spec']['widgetData']

const EventList = ({ uid, widgetData }: WidgetProps<EventListWidgetData>) => {
  const { events, prefix, sseEndpoint, sseTopic } = widgetData

  const { config } = useConfigContext()
  const { getFilteredData } = useFilter()
  const [loading, setLoading] = useState<boolean>(!!sseEndpoint && !!sseTopic)

  const [eventList, setEventList] = useState<EventsApiResource[]>(events || [])

  useEffect(() => {
    if (!sseEndpoint || !sseTopic) { return }

    const timeout = setTimeout(() => setLoading(false), 10000)

    if (sseEndpoint.startsWith('krateo-test-mock')) {
      let counter = 0
      const maxEvents = 5
      const interval = setInterval(() => {
        if (counter >= maxEvents) {
          clearInterval(interval)
          setLoading(false)
          return
        }

        const fakeEvent: EventsApiResource = {
          cluster_name: 'mock-cluster',
          created_at: new Date().toISOString(),
          event_type: 'Normal',
          global_uid: `mock-${Date.now()}`,
          message: `Simulated Kubernetes event #${counter + 1}`,
          namespace: 'default',
          raw: '',
          reason: 'MockEvent',
          resource_kind: 'Pod',
          resource_name: 'example-pod',
        }

        setEventList((prev) => [fakeEvent, ...prev].slice(0, 200))
        setLoading(false)
        counter += 1
      }, 2000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }

    const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}${sseEndpoint.endsWith('/')
      ? sseEndpoint.slice(0, -1)
      : sseEndpoint}`

    try {
      const eventSource = new EventSource(eventsEndpoint, { withCredentials: false })

      eventSource.addEventListener(sseTopic, (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as EventsApiResource
          setEventList((prev) => [data, ...prev].slice(0, 200))
          setLoading(false)
        } catch (error) {
          console.error('Error parsing event data:', error)
        }
      })

      eventSource.onerror = (err) => {
        console.warn('SSE connection failed:', err)
        setLoading(false)
        eventSource.close()
      }

      return () => {
        eventSource.close()
        clearTimeout(timeout)
      }
    } catch (error) {
      console.warn('Error initializing SSE connection:', error)
      setLoading(false)
    }
  }, [config, sseEndpoint, sseTopic])

  const filteredEventList = useMemo(() => {
    if (prefix && eventList.length > 0) {
      return getFilteredData(eventList, prefix) as EventsApiResource[]
    }

    return eventList
  }, [prefix, eventList, getFilteredData])

  if (loading) {
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
