import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { useMemo } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { TabList as WidgetType } from './TabList.type'

export type TabListWidgetData = WidgetType['spec']['widgetData']

const TabList = ({ resourcesRefs, uid, widgetData }: WidgetProps<TabListWidgetData>) => {
  const { items } = widgetData

  const tabItems = useMemo(() => {
    return items.reduce<NonNullable<TabsProps['items']>>((acc, { label, resourceRefId }, index) => {
      const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
      if (!endpoint) { return acc }

      acc.push({
        children: <WidgetRenderer widgetEndpoint={endpoint} />,
        key: `${uid}-${index}`,
        label,
      })

      return acc
    }, [])
  }, [items, resourcesRefs, uid])

  return <Tabs items={tabItems} key={uid} />
}

export default TabList
