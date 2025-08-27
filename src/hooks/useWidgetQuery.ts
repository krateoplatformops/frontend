/* eslint-disable sort-keys/sort-keys-fix */
/* this rules conflicts with react-query ordering required for correct type inference */

import { useInfiniteQuery } from '@tanstack/react-query'

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

  return useInfiniteQuery({
    queryKey: ['widgets', widgetEndpoint, options],
    queryFn: ({ pageParam }) => fetchWidget(pageParam),
    initialPageParam: {
      page: options.page,
      perPage: options.perPage,
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.status?.resourcesRefs?._slice_.continue === false) {
        /* to signal there are not other pages */
        return undefined
      }

      return {
        page: pages.length + 1,
        perPage: options.perPage,
      }
    },
    select: (data) => {
      const [firstPage] = data.pages

      if (typeof firstPage.status !== 'object') {
        return firstPage
      }

      // Merge items from all pages
      const allResourcesRefs: ResourceRef[] = []
      const allWidgetDataItems: unknown[] = []

      for (const page of data.pages) {
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

      // Return NEW object to ensure React detects the change
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
    },
  })
}
