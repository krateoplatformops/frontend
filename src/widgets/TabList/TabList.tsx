import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { useMemo } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

const TabList = ({ widgetData, resourcesRefs }: WidgetProps<{
  items: Array<{ label: string; resourceRefId: string }>
}>) => {
  const { items } = widgetData

  const tabItems: TabsProps['items'] = useMemo(() => items.map(({ label, resourceRefId }, index) => ({
    children: <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />,
    key: `tab-${index}`,
    label,
  })), [items, resourcesRefs])


  return <Tabs items={tabItems} />
}

export default TabList
