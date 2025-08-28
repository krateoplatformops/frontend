import { Col as AntdColumn } from 'antd'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Column.module.css'
import type { Column as WidgetType } from './Column.type'

export type ColumnWidgetData = WidgetType['spec']['widgetData']

const Column = ({
  fetchNextPage,
  hasNextPage,
  page,
  perPage,
  resourcesRefs,
  uid,
  widgetData,
}: WidgetProps<ColumnWidgetData> & { fetchNextPage?: () => void }) => {
  const { items, size } = widgetData
  const { inView, ref } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <>
      <AntdColumn className={styles.column} key={uid} span={size}>
        {items
          .map(({ resourceRefId }, index) => {
            const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
            if (!endpoint) {
              return null
            }

            return <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={endpoint} />
          })
          .filter(Boolean)}
      </AntdColumn>
      {/* {hasNextPage && fetchNextPage && (
        <button
          onClick={() => {
            void fetchNextPage()
          }}
        >
          load more
        </button>
      )} */}

      <div ref={ref} style={{ fontSize: '80px', height: '100px' }}>
        <div>inView: {inView.toString()}</div>
        <div>has more items: {hasNextPage?.toString()}</div>
      </div>
    </>
  )
}

export default Column
