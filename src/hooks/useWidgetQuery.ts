import { useQuery } from '@tanstack/react-query'

import { useConfigContext } from '../context/ConfigContext'
import type { Widget } from '../types/Widget'
import { getAccessToken } from '../utils/getAccessToken'

export const useWidgetQuery = (widgetEndpoint: string) => {
  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${widgetEndpoint}`

  const url = new URL(widgetFullUrl)
  url.searchParams.set('page', '1')
  url.searchParams.set('per_page', '3')

  const urlString = url.toString()

  return useQuery({
    queryFn: async () => {
      const res = await fetch(urlString, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      const widget = (await res.json()) as Widget
      return widget
    },
    queryKey: ['widgets', urlString],
  })
}
