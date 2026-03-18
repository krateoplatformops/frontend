/* eslint-disable sort-keys/sort-keys-fix */
/* this rules conflicts with react-query ordering required for correct type inference */

import { useInfiniteQuery, useIsFetching } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { ResourceRef, Widget } from '../types/Widget'
import { getAccessToken } from '../utils/getAccessToken'

function parseNumberParam(param: string | null) {
  const parsed = param ? parseInt(param) : undefined
  return isNaN(parsed!) ? undefined : parsed
}

type PageParam = {
  page?: number
  perPage?: number
  cursor?: string
}

export const useWidgetQuery = (widgetEndpoint: string, options?: { enabled: boolean }) => {
  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${widgetEndpoint}`

  const {
    initialCursor,
    initialPage,
    initialPerPage,
    isCursorPagination,
    requestUrl,
  } = useMemo(() => {
    let url: URL | null = null
    let page: number | undefined
    let perPage: number | undefined
    let cursor: string | undefined

    try {
      url = new URL(widgetFullUrl)
      page = parseNumberParam(url.searchParams.get('page'))
      perPage = parseNumberParam(url.searchParams.get('perPage'))
      cursor = url.searchParams.get('cursor') ?? undefined
    } catch (error) {
      console.error('useWidgetQuery: error in generating URL: ', error)
    }

    const isCursorPagination = page === undefined && perPage === undefined

    return {
      requestUrl: url,
      initialPage: page,
      initialPerPage: perPage,
      initialCursor: cursor,
      isCursorPagination,
    }
  }, [widgetFullUrl])

  const enabledFlag = (options?.enabled ?? true) && requestUrl !== null

  async function fetchWidget({ cursor, page, perPage }: PageParam): Promise<Widget> {
    if (!requestUrl) {
      throw new Error('Cannot fetch widget: invalid URL')
    }

    const url = new URL(requestUrl.toString())

    if (isCursorPagination) {
      if (cursor) {
        url.searchParams.set('cursor', cursor)
      }
    } else {
      if (typeof page === 'number') {
        url.searchParams.set('page', page.toString())
      }
      if (typeof perPage === 'number') {
        url.searchParams.set('perPage', perPage.toString())
      }
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return (await res.json()) as Widget
  }

  const queryResult = useInfiniteQuery({
    enabled: enabledFlag,
    queryKey: ['widgets', widgetEndpoint],
    queryFn: ({ pageParam }) => fetchWidget(pageParam),
    initialPageParam: isCursorPagination ? { cursor: initialCursor } : { page: initialPage, perPage: initialPerPage },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (isCursorPagination) {
        const nextCursor = typeof lastPage.status === 'object'
          ? lastPage.status.resourcesRefs?.slice?.cursor
          : undefined

        if (!nextCursor) {
          return undefined
        }

        return { cursor: nextCursor }
      }

      if (typeof lastPageParam.page !== 'number') {
        return undefined
      }

      const hasMorePages = typeof lastPage.status === 'object' && lastPage.status.resourcesRefs?.slice?.continue === true

      if (!hasMorePages) {
        return undefined
      }

      return {
        page: lastPageParam.page + 1,
        perPage: lastPageParam.perPage,
      }
    },
    select: (data) => {
      const [firstPage] = data.pages

      if (typeof firstPage.status !== 'object') {
        return firstPage
      }

      const allResourcesRefs: ResourceRef[] = []
      const allWidgetDataItems: unknown[] = []

      for (const page of data.pages) {
        if (typeof page.status === 'object' && page.status?.resourcesRefs?.items) {
          allResourcesRefs.push(...page.status.resourcesRefs.items)
        }

        if (
          typeof page.status === 'object'
          && page.status?.widgetData
          && typeof page.status.widgetData === 'object'
          && 'items' in page.status.widgetData
          && Array.isArray((page.status.widgetData as { items: unknown[] }).items)
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
    },
  })

  const resourcesRefsPaths = typeof queryResult.data?.status === 'object'
    ? queryResult.data.status.resourcesRefs?.items.map((item) => item.path)
    : []

  const resourcesRefsFetching = useIsFetching({
    predicate: (query) => {
      const resourceRefPath = query.queryKey[1] as string

      if (!resourcesRefsPaths) { return false }

      return resourcesRefsPaths.includes(resourceRefPath)
    },
  })

  return {
    queryResult,
    isFetchingResourcesRefs: resourcesRefsFetching > 0,
  }
}
