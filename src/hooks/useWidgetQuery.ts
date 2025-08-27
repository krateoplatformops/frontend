/* eslint-disable sort-keys/sort-keys-fix */
/* this rules conflicts with react-query ordering required for correct type inference */

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { ResourceRef, Widget } from '../types/Widget'
import { getAccessToken } from '../utils/getAccessToken'

export interface PaginationOptions {
  page: number
  perPage: number
}

export const useWidgetQuery = (widgetEndpoint: string, options: PaginationOptions) => {
  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${widgetEndpoint}`

  const fetchWidget = async ({ page, perPage }: { page: number; perPage: number }) => {
    const url = new URL(widgetFullUrl)

    /* TODO: read from _slice_ */
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', perPage.toString())

    const urlString = url.toString()

    const res = await fetch(urlString, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    const widget = (await res.json()) as Widget
    return widget
  }

  const query = useInfiniteQuery({
    queryKey: ['widgets', widgetEndpoint, options],
    queryFn: ({ pageParam }) => fetchWidget(pageParam),
    initialPageParam: {
      page: options.page,
      perPage: options.perPage,
    },
    getNextPageParam: (_lastPage, pages) => {
      return {
        page: pages.length + 1,
        perPage: options.perPage,
      }
    },
  })

  // Merge all page data into a single widget - use useMemo for reactivity
  const mergedWidget = useMemo(() => {
    if (!query.data?.pages?.[0]) {
      return undefined
    }

    const [firstPage] = query.data.pages

    if (typeof firstPage.status !== 'object') {
      return firstPage
    }

    // Merge items from all pages
    const allResourcesRefs: ResourceRef[] = []
    const allWidgetDataItems: unknown[] = []

    for (const page of query.data.pages) {
      if (typeof page.status === 'object' && page.status?.resourcesRefs?.items) {
        allResourcesRefs.push(...page.status.resourcesRefs.items)
      }
      if (
        typeof page.status === 'object' &&
        page.status?.widgetData &&
        typeof page.status.widgetData === 'object' &&
        'items' in page.status.widgetData &&
        Array.isArray((page.status.widgetData as { items: unknown[] }).items)
      ) {
        allWidgetDataItems.push(...(page.status.widgetData as { items: unknown[] }).items)
      }
    }

    return {
      ...firstPage,
      status: {
        ...firstPage.status,
        resourcesRefs: {
          ...firstPage.status.resourcesRefs,
          items: allResourcesRefs,
        },
        widgetData: {
          ...(firstPage.status.widgetData as Record<string, unknown>),
          items: allWidgetDataItems,
        },
      },
    }
  }, [query.data?.pages])

  return {
    data: mergedWidget,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
  }
}
