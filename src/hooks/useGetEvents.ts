import type { InfiniteData, QueryKey } from '@tanstack/react-query'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { EventsApiResource, EventsApiResponse } from '../utils/types'

type UseGetEventsOptions = {
  enabled?: boolean
  topic?: string
  registerToSSE?: boolean
  sseEndpoint?: string
}

const sseConnections = new Map<string, EventSource>()

export function useGetEvents({
  enabled,
  registerToSSE = true,
  sseEndpoint,
  topic = 'krateo',
}: UseGetEventsOptions) {
  const { config } = useConfigContext()
  const queryClient = useQueryClient()

  const eventsBaseUrl = config!.api.EVENTS_API_BASE_URL
  const eventsUrl = `${eventsBaseUrl}/events`

  const notificationsUrl = useMemo(() =>
    new URL(sseEndpoint ?? '/notifications', config!.api.EVENTS_PUSH_API_BASE_URL).toString(),
  [config, sseEndpoint])

  const queryKey = ['events', eventsUrl, topic, sseEndpoint] as const
  const unreadKey: QueryKey = ['events-unread', topic, sseEndpoint ?? undefined]

  // Infinite query
  const queryResult = useInfiniteQuery<
    EventsApiResponse,
    Error,
    InfiniteData<EventsApiResponse>,
    typeof queryKey,
    string | undefined
  >({
    enabled: !!enabled && !!eventsBaseUrl,
    gcTime: 5 * 60_000,
    queryFn: async ({ pageParam, signal }) => {
      const [, eventsUrl] = queryKey

      const url = pageParam ? `${eventsUrl}?cursor=${pageParam}` : eventsUrl
      const res = await fetch(url, { signal })

      return (await res.json()) as EventsApiResponse
    },
    // eslint-disable-next-line sort-keys/sort-keys-fix
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    initialPageParam: undefined,
    queryKey,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  const events = useMemo(() =>
    queryResult.data?.pages.flatMap(page => page.resources) ?? [],
  [queryResult.data])

  useEffect(() => {
    if (!enabled || !registerToSSE) {
      const source = sseConnections.get(`${notificationsUrl}:${topic}`)

      if (source) {
        source.close()
        sseConnections.delete(`${notificationsUrl}:${topic}`)
      }

      return
    }

    const connectionKey = `${notificationsUrl}:${topic}`

    if (!sseConnections.has(connectionKey)) {
      const eventSource = new EventSource(notificationsUrl, { withCredentials: false })
      sseConnections.set(connectionKey, eventSource)

      eventSource.onerror = console.error

      eventSource.addEventListener(topic, (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data) as EventsApiResource

          queryClient.setQueryData<InfiniteData<EventsApiResponse>>(queryKey, prev => {
            if (!prev) { return prev }
            const [firstPage, ...rest] = prev.pages
            const exists = firstPage.resources.some(event => event.global_uid === data.global_uid)
            if (exists) { return prev }

            return {
              ...prev,
              pages: [
                { ...firstPage, resources: [data, ...firstPage.resources] },
                ...rest,
              ],
            }
          })

          queryClient.setQueryData(unreadKey, (prev: number = 0) => prev + 1)
        } catch (err) {
          console.error('SSE parse error:', err)
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
  }, [enabled, registerToSSE, notificationsUrl, topic, queryClient, queryKey, unreadKey])

  // Auto-fetch next page
  useEffect(() => {
    if (!enabled) { return }
    if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
      queryResult.fetchNextPage().catch(error => console.error(error))
    }
  }, [enabled, queryResult.hasNextPage, queryResult.isFetchingNextPage, queryResult.fetchNextPage])

  const unreadCount = queryClient.getQueryData<number>(unreadKey) ?? 0

  return {
    data: events,
    fetchNextPage: queryResult.fetchNextPage,
    hasNextPage: queryResult.hasNextPage,
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch,
    unreadCount,
  }
}
