import type { TabsProps } from 'antd'
import { Empty, Result, Tabs } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './TabList.module.css'
import type { TabList as WidgetType } from './TabList.type'

export type TabListWidgetData = WidgetType['spec']['widgetData']

const TabList = ({ resourcesRefs, uid, widgetData }: WidgetProps<TabListWidgetData>) => {
  const { items } = widgetData
  const [searchParams, setSearchParams] = useSearchParams()

  const tabItems = useMemo(() => {
    return items.reduce<NonNullable<TabsProps['items']>>((acc, { label, resourceRefId, title }, index) => {
      const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)

      acc.push({
        children: (
          <div className={styles.container}>
            {title && <div className={styles.title}>{title}</div>}
            {endpoint
              ? <WidgetRenderer widgetEndpoint={endpoint} />
              : <Result
                status='error'
                subTitle={`The tab references an invalid resource with resourceRefId: ${resourceRefId}`}
                title={'Error while rendering tab'}
              />
            }
          </div>
        ),
        key: `${uid}-${index}`,
        label,
      })

      return acc
    }, [])
  }, [items, resourcesRefs, uid])

  const paramKey = `tab-${uid}`
  const storedKey = searchParams.get(paramKey)
  const activeKey = tabItems.some(({ key }) => key === storedKey) ? storedKey! : (tabItems[0]?.key ?? '')

  const handleTabChange = (key: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set(paramKey, key)
      return next
    },
    { replace: true }
    )
  }

  if (!items.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return <Tabs activeKey={activeKey} items={tabItems} key={uid} onChange={handleTabChange} />
}

export default TabList
