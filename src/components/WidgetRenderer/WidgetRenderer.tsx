import { Result, Skeleton } from 'antd'

import useCatchError from '../../hooks/useCatchError'
import { useWidgetQuery } from '../../hooks/useWidgetQuery'
import type { Widget } from '../../types/Widget'
import BarChart from '../../widgets/BarChart'
import type { BarChartWidgetData } from '../../widgets/BarChart/BarChart'
import Button from '../../widgets/Button'
import type { ButtonWidgetData } from '../../widgets/Button/Button'
import Column from '../../widgets/Column'
import type { ColumnWidgetData } from '../../widgets/Column/Column'
import type { DataGridWidgetData } from '../../widgets/DataGrid/DataGrid'
import DataGrid from '../../widgets/DataGrid/DataGrid'
import EventList from '../../widgets/EventList'
import type { EventListWidgetData } from '../../widgets/EventList/EventList'
import Filters from '../../widgets/Filters'
import type { FiltersWidgetData } from '../../widgets/Filters/Filters'
import type { FlowChartWidgetData } from '../../widgets/FlowChart/FlowChart'
import FlowChart from '../../widgets/FlowChart/FlowChart'
import Form, { type FormWidgetData } from '../../widgets/Form/Form'
import LineChart from '../../widgets/LineChart'
import type { LineChartWidgetData } from '../../widgets/LineChart/LineChart'
import Markdown from '../../widgets/Markdown'
import type { MarkdownWidgetData } from '../../widgets/Markdown/Markdown'
import type { NavMenuWidgetData } from '../../widgets/NavMenu/NavMenu'
import { NavMenu } from '../../widgets/NavMenu/NavMenu'
import { Page, type PageWidgetData } from '../../widgets/Page/Page'
import type { PanelWidgetData } from '../../widgets/Panel/Panel'
import Panel from '../../widgets/Panel/Panel'
import Paragraph from '../../widgets/Paragraph'
import type { ParagraphWidgetData } from '../../widgets/Paragraph/Paragraph'
import type { PieChartWidgetData } from '../../widgets/PieChart/PieChart'
import PieChart from '../../widgets/PieChart/PieChart'
import type { RouteWidgetData } from '../../widgets/Route/Route'
import { Route } from '../../widgets/Route/Route'
import type { RoutesLoaderWidgetData } from '../../widgets/RoutesLoader/RoutesLoader'
import { RoutesLoader } from '../../widgets/RoutesLoader/RoutesLoader'
import Row from '../../widgets/Row'
import type { RowWidgetData } from '../../widgets/Row/Row'
import type { TableWidgetData } from '../../widgets/Table/Table'
import Table from '../../widgets/Table/Table'
import TabList from '../../widgets/TabList'
import type { TabListWidgetData } from '../../widgets/TabList/TabList'
import YamlViewer from '../../widgets/YamlViewer'
import type { YamlViewerWidgetData } from '../../widgets/YamlViewer/YamlViewer'
import { useFilter } from '../FiltesProvider/FiltersProvider'

import styles from './WidgetRenderer.module.css'

function parseData({
  fetchNextPage,
  hasNextPage,
  widget,
  widgetEndpoint,
}: {
  widget: Widget
  widgetEndpoint: string
  fetchNextPage?: () => Promise<unknown> | void
  hasNextPage?: boolean
}) {
  const { kind, metadata, status } = widget

  if (!status) {
    return (
      <div className={styles.message}>
        <Result status='error' subTitle={`Widget ${kind} does not have a status specification`} title='Error while rendering widget' />
      </div>
    )
  }

  if (typeof status === 'string') {
    if (kind === 'Status') {
      const params = new URLSearchParams(widgetEndpoint)

      return (
        <div className={styles.message}>
          <Result
            status='error'
            subTitle={`There has been an error while rendering a widget with the following specification:`}
            title='Error while rendering widget'
          >
            <div className={styles.content}>
              <pre className={styles.pre}>
                <b>Name:</b> {params.get('name')}
                {'\n'}
                <b>Namespace:</b> {params.get('namespace')}
                {'\n'}
                <b>Version:</b> {params.get('apiVersion')}
                {'\n'}
                <b>Endpoint:</b> {widgetEndpoint}
                {'\n'}
                {'\n'}
                <b>Widget:</b> {JSON.stringify(widget, null, 2)}
                {'\n'}
              </pre>
            </div>
          </Result>
        </div>
      )
    }

    return (
      <div className={styles.message}>
        <Result status='error' subTitle={`Status for ${kind} widget is in string format: ${status}`} title='Error while rendering widget' />
      </div>
    )
  }

  const { resourcesRefs, widgetData } = status
  const uid = metadata?.uid

  switch (kind) {
    case 'BarChart':
      return <BarChart resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as BarChartWidgetData} />
    case 'Button':
      return <Button resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ButtonWidgetData} />
    case 'Column':
      return (
        <Column
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          resourcesRefs={resourcesRefs}
          uid={uid}
          widgetData={widgetData as ColumnWidgetData}
        />
      )
    case 'DataGrid':
      return <DataGrid resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as DataGridWidgetData} />
    case 'EventList':
      return <EventList resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as EventListWidgetData} />
    case 'Filters':
      return <Filters resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FiltersWidgetData} />
    case 'FlowChart':
      return <FlowChart resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FlowChartWidgetData} />
    case 'Form':
      return <Form resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FormWidgetData} />
    case 'LineChart':
      return <LineChart resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as LineChartWidgetData} />
    case 'Markdown':
      return <Markdown resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as MarkdownWidgetData} />
    case 'NavMenu':
      return <NavMenu resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as NavMenuWidgetData} />
    case 'Page':
      return <Page resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as PageWidgetData} />
    case 'Panel':
      return <Panel resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as PanelWidgetData} />
    case 'PieChart':
      return <PieChart resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as PieChartWidgetData} />
    case 'Paragraph':
      return <Paragraph resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ParagraphWidgetData} />
    case 'Route':
      return <Route resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as RouteWidgetData} />
    case 'RoutesLoader':
      return <RoutesLoader resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as RoutesLoaderWidgetData} />
    case 'Row':
      return <Row resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as RowWidgetData} />
    case 'Table':
      return <Table resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as TableWidgetData} />
    case 'TabList':
      return <TabList resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as TabListWidgetData} />
    case 'YamlViewer':
      return <YamlViewer resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as YamlViewerWidgetData} />
    case 'Pod':
      return (
        <div style={{ border: '1px solid red', height: '100px' }}>
          <details>
            <summary>Pod {metadata?.name}</summary>
            <pre>
              {JSON.stringify(
                {
                  metadata,
                  resourcesRefs,
                  uid,
                },
                null,
                2
              )}
            </pre>
            {JSON.stringify({
              metadata,
              resourcesRefs,
              uid,
            })}
          </details>
        </div>
      )
    default:
      throw new Error(`Unknown widget kind: ${kind}`)
  }
}

type WidgetRendererProps = {
  invisible?: boolean
  page?: number
  perPage?: number
  prefix?: string
  widgetEndpoint: string
  wrapper?: {
    component: React.ComponentType<{ children: React.ReactNode }>
    props?: Record<string, unknown>
  }
}

const WidgetRenderer = ({ invisible = false, page, perPage, prefix, widgetEndpoint, wrapper }: WidgetRendererProps) => {
  const { isWidgetFilteredByProps } = useFilter()
  const { catchError } = useCatchError()

  if (!widgetEndpoint?.includes('widgets.templates.krateo.io')) {
    console.warn(`WidgetRenderer received widgetEndpoint=${widgetEndpoint}, which is probably invalid an url is expected`)
  }

  const {
    data: widget,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useWidgetQuery(widgetEndpoint, {
    page: page ?? 1,
    perPage: perPage ?? 10,
  })

  // check if widget is filtered out by filters
  if (typeof widget?.status === 'object' && widget?.status?.widgetData) {
    if (prefix) {
      if (isWidgetFilteredByProps(widget.status.widgetData, prefix)) {
        return null
      }
    }
  }

  if (invisible) {
    if (widget) {
      return parseData({ widget, widgetEndpoint })
    }
    return null
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Skeleton active />
      </div>
    )
  }

  if (!widget) {
    return (
      <div className={styles.message}>
        <Result status='error' subTitle={`The widget does not exist`} title='Error while rendering widget' />
      </div>
    )
  }

  if (error) {
    console.error(error)

    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`There has been an error while fetching the widget: ${error}`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  if (widget.kind === 'Status' && widget?.code === 401) {
    catchError(
      {
        data: {
          message: widget?.message,
        },
        message: `Authentication error (code: ${widget.code})`,
        status: widget.code,
      },
      'notification'
    )
  }

  if (widget.kind === 'Status' && widget?.code === 500 && widget?.status === 'Failure' && widget?.message?.includes('credentials')) {
    catchError(
      {
        status: widget.code,
      },
      'notification'
    )
    window.location.replace('/login')
  }

  if (wrapper) {
    const Wrapper = wrapper.component

    return <Wrapper {...wrapper.props}>{parseData({ widget, widgetEndpoint })}</Wrapper>
  }

  return parseData({ fetchNextPage, hasNextPage, widget, widgetEndpoint })
}

export default WidgetRenderer
