import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { useMemo } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { TabList as WidgetType } from './TabList.type'

export type TabListWidgetData = WidgetType['spec']['widgetData']

const TabList = ({ resourcesRefs, widgetData }: WidgetProps<TabListWidgetData>) => {
  const { items } = widgetData

  const tabItems: TabsProps['items'] = useMemo(() => items.map(({ label, resourceRefId }, index) => ({
    children: <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />,
    key: `tab-${index}`,
    label,
  })), [items, resourcesRefs])


  return <Tabs items={tabItems} />
}

export default TabList
