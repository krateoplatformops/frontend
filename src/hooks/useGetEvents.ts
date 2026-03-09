import type { QueryKey } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { EventsApiResource, EventsApiResponse } from '../utils/types'

type UseGetEventsOptions = {
  topic?: string
  registerToSSE?: boolean
  sseEndpoint?: string
}

const MAX_PAGES = 50

// evita connessioni SSE duplicate
const sseConnections = new Map<string, EventSource>()

export function useGetEvents({
  registerToSSE = true,
  sseEndpoint,
  topic = 'krateo',
}: UseGetEventsOptions) {
  const { config } = useConfigContext()
  const queryClient = useQueryClient()

  const eventsUrl = `${config!.api.EVENTS_API_BASE_URL}/events`

  const notificationsUrl = useMemo(() => {
    return new URL(
      sseEndpoint ?? '/notifications',
      config!.api.EVENTS_PUSH_API_BASE_URL
    ).toString()
  }, [config, sseEndpoint])

  const queryKey: QueryKey = useMemo(
    () => ['events', eventsUrl, 'topic', topic, 'endpoint', sseEndpoint, 'maxPages', MAX_PAGES],
    [eventsUrl, topic, sseEndpoint]
  )

  const unreadKey: QueryKey = useMemo(
    () => ['events-unread', topic, sseEndpoint],
    [topic, sseEndpoint]
  )

  const queryResult = useQuery({
    gcTime: Infinity,
    queryFn: async () => {
      let cursor: string | undefined
      let pages = 0
      const allEvents: EventsApiResource[] = []

      do {
        const url = cursor ? `${eventsUrl}?cursor=${cursor}` : eventsUrl

        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(url)

        // eslint-disable-next-line no-await-in-loop
        const data = (await res.json()) as EventsApiResponse

        allEvents.push(...data.resources)
        cursor = data.cursor

        pages += 1
      } while (cursor && pages < MAX_PAGES)

      return allEvents
    },
    queryKey,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!registerToSSE) { return }

    const connectionKey = `${notificationsUrl}:${topic}`

    if (!sseConnections.has(connectionKey)) {
      const eventSource = new EventSource(notificationsUrl, {
        withCredentials: false,
      })

      sseConnections.set(connectionKey, eventSource)

      eventSource.onerror = (event) => {
        console.error('[SSE] Connection error:', event)
      }

      eventSource.addEventListener(topic, (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as EventsApiResource

          queryClient.setQueryData(queryKey, (prev: EventsApiResource[] = []) => {
            const alreadyExists = prev.some(event => event.global_uid === data.global_uid)

            if (alreadyExists) { return prev }

            return [data, ...prev]
          })

          queryClient.setQueryData(unreadKey, (prev: number = 0) => prev + 1)
        } catch (error) {
          console.error('Error parsing event data:', error)
        }
      })
    }

    return () => {
      const source = sseConnections.get(connectionKey)

      if (source) {
        source.close()
        sseConnections.delete(connectionKey)
      }
    }
  }, [notificationsUrl, topic, registerToSSE, queryClient, queryKey, unreadKey])

  const unreadCount
    = queryClient.getQueryData<number>(unreadKey) ?? 0

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
    unreadCount,
  }
}
