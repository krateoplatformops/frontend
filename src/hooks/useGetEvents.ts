import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  MessageEvent,
  EventListener,
} from 'event-source-polyfill'
import {
  EventSourcePolyfill,
} from 'event-source-polyfill'
import { useEffect, useMemo, useState } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import { getAccessToken } from '../utils/getAccessToken'
import type { EventsApiResource, EventsApiResponse } from '../utils/types'

type UseGetEventsOptions = {
  enabled?: boolean
  topic?: string
  registerToSSE?: boolean
  sseEndpoint?: string
}

const sseConnections = new Map<string, EventSource>()

export function useGetEvents({
  enabled = true,
  registerToSSE = true,
  sseEndpoint,
  topic = 'krateo',
}: UseGetEventsOptions) {
  const { config } = useConfigContext()
  const queryClient = useQueryClient()

  const [sseEvents, setSseEvents] = useState<EventsApiResource[]>([])

  const eventsBaseUrl = config!.api.EVENTS_API_BASE_URL
  const eventsUrl = `${eventsBaseUrl}/events`

  const notificationsUrl = useMemo(() =>
    new URL(sseEndpoint ?? '/notifications', config!.api.EVENTS_PUSH_API_BASE_URL).toString(),
  [config, sseEndpoint])

  const queryKey = useMemo(() => ['events', eventsUrl] as const, [eventsUrl],)
  const unreadKey = useMemo(() => ['events-unread', topic, sseEndpoint ?? undefined] as const, [topic, sseEndpoint])
  const isSseOnly = !!sseEndpoint

  const queryResult = useInfiniteQuery<
    EventsApiResponse,
    Error,
    InfiniteData<EventsApiResponse>,
    typeof queryKey,
    string | undefined
  >({
    enabled: enabled && !!eventsBaseUrl && !isSseOnly,
    gcTime: 5 * 60_000,
    queryFn: async ({ pageParam, queryKey, signal }) => {
      const [, currentEventsUrl] = queryKey

      const url = pageParam
        ? `${currentEventsUrl}?cursor=${pageParam}`
        : currentEventsUrl

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        signal })
      return (await res.json()) as EventsApiResponse
    },
    // eslint-disable-next-line sort-keys/sort-keys-fix
    initialPageParam: undefined,
    // eslint-disable-next-line sort-keys/sort-keys-fix
    getNextPageParam: (lastPage) =>
      (lastPage.cursor && lastPage.cursor.length > 0
        ? lastPage.cursor
        : undefined),
    queryKey,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  const fetchedEvents = useMemo(() => queryResult.data?.pages.flatMap((page) => page.resources) ?? [], [queryResult.data])

  useEffect(() => {
    const connectionKey = `${notificationsUrl}:${topic}`

    if (!enabled || !registerToSSE) {
      const source = sseConnections.get(connectionKey)
      if (source) {
        source.close()
        sseConnections.delete(connectionKey)
      }
      return
    }

    if (!sseConnections.has(connectionKey)) {
      const eventSource = new EventSourcePolyfill(notificationsUrl, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        withCredentials: false,
      })

      sseConnections.set(connectionKey, eventSource)

      const handleIncoming = (raw: string) => {
        try {
          const data = JSON.parse(raw) as EventsApiResource

          setSseEvents((prev) => {
            const exists = prev.some((item) => item.global_uid === data.global_uid)
            if (exists) { return prev }

            return [data, ...prev].slice(0, 200)
          })

          queryClient.setQueryData<number>(unreadKey, (prev = 0) => prev + 1)
        } catch (err) {
          console.error('SSE parse error:', err)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE error', error)
      }

      eventSource.addEventListener(topic, ((event: MessageEvent) => {
        handleIncoming(event.data as string)
      }) as EventListener)

      eventSource.onmessage = (event: MessageEvent) => {
        handleIncoming(event.data as string)
      }
    }

    return () => {
      const source = sseConnections.get(connectionKey)

      if (source) {
        source.close()
        sseConnections.delete(connectionKey)
      }
    }
  }, [
    enabled,
    registerToSSE,
    notificationsUrl,
    topic,
    queryClient,
    unreadKey,
  ])

  const events = useMemo(() => {
    if (isSseOnly) {
      return sseEvents
    }

    const merged = [...sseEvents, ...fetchedEvents]
    const seen = new Set<string>()
    return merged.filter((item) => {
      if (seen.has(item.global_uid)) { return false }
      seen.add(item.global_uid)
      return true
    })
  }, [isSseOnly, sseEvents, fetchedEvents])

  const { data: unreadCount = 0 } = useQuery<number>({
    initialData: 0,
    queryFn: () => 0,
    queryKey: unreadKey,
    staleTime: Infinity,
  })

  return {
    data: events,
    fetchNextPage: queryResult.fetchNextPage,
    hasNextPage: isSseOnly ? false : queryResult.hasNextPage,
    isFetchingNextPage: isSseOnly ? false : queryResult.isFetchingNextPage,
    isLoading: isSseOnly ? false : queryResult.isLoading,
    refetch: queryResult.refetch,
    unreadCount,
  }
}
