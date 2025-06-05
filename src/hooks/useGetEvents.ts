import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useConfigContext } from '../context/ConfigContext'
import { SSEK8sEvent } from '../utils/types'

export function useGetEvents({ topic = 'krateo', registerToSSE = true }: { topic?: string; registerToSSE?: boolean }) {
  const { config } = useConfigContext()
  const refConnected = useRef(false)

  /* list of events */
  const eventsUrl = config!.api.EVENTS_API_BASE_URL + '/events'

  /* stream of events */
  const notificationsUrl = config!.api.EVENTS_PUSH_API_BASE_URL + '/notifications'
  const queryKey: QueryKey = ['events', 'topic', topic]

  const queryClient = useQueryClient()
  const queryResult = useQuery({
    /* Prevent all automatic refetching, SSE will handle new events  */
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const res = await fetch(eventsUrl)
      const notifications = (await res.json()) as SSEK8sEvent[]
      return notifications.reverse()
    },
    queryKey,
  })

  useEffect(() => {
    if (!registerToSSE) {
      return
    }
    if (refConnected.current) {
      console.warn('already connected to SSE')
      return
    }

    const eventSource = new EventSource(notificationsUrl, {
      withCredentials: false,
    })
    eventSource.onopen = () => {
      refConnected.current = true
    }

    eventSource.onerror = (event) => {
      console.error('error', event)
      refConnected.current = false
    }

    const handler = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as SSEK8sEvent[]
      queryClient.setQueryData(queryKey, (prev: SSEK8sEvent[]) => [data, ...prev])
    }

    eventSource.addEventListener(topic, handler)

    return () => {
      refConnected.current = false
      eventSource
      eventSource.close()
    }
  }, [queryKey, topic])

  return queryResult
}
