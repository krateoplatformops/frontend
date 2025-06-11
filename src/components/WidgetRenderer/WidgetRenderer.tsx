import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Result, Spin } from 'antd'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
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
import LineChart from '../../widgets/LineChart'
import type { LineChartWidgetData } from '../../widgets/LineChart/LineChart'
import type { NavMenuWidgetData } from '../../widgets/NavMenu/NavMenu'
import { NavMenu } from '../../widgets/NavMenu/NavMenu'
import type { PanelWidgetData } from '../../widgets/Panel/Panel'
import Panel from '../../widgets/Panel/Panel'
import Paragraph from '../../widgets/Paragraph'
import type { ParagraphWidgetData } from '../../widgets/Paragraph/Paragraph'
import type { PieChartWidgetData } from '../../widgets/PieChart/PieChart'
import PieChart from '../../widgets/PieChart/PieChart'
import type { RouteWidgetData } from '../../widgets/Route/Route'
import { Route } from '../../widgets/Route/Route'
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

function parseData(widget: Widget, widgetEndpoint: string, setData: (prefix: string, componentId: string, data: unknown[]) => void, getFilteredData: (prefix: string, componentId: string) => unknown[]) {
  const { kind, status } = widget

  if (!status) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`Widget ${kind} does not have a status specification`}
          title='Error while rendering widget'
        />
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
                <b>Name:</b> {params.get('name')}{'\n'}
                <b>Namespace:</b> {params.get('namespace')}{'\n'}
                <b>Version:</b> {params.get('apiVersion')}{'\n'}
                <b>Endpoint:</b> {widgetEndpoint}{'\n'}{'\n'}
                <b>Widget:</b> {JSON.stringify(widget, null, 2)}{'\n'}
              </pre>
            </div>
          </Result>
        </div>
      )
    }

    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`Status for ${kind} widget is in string format: ${status}`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const { actions, resourcesRefs, widgetData } = status

  switch (kind) {
    case 'Button':
      return <Button actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as ButtonWidgetData }/>
    case 'Column':
      return <Column actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as ColumnWidgetData} />
    case 'EventList':
      return <EventList actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as EventListWidgetData} />
    case 'NavMenu':
      return <NavMenu actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as NavMenuWidgetData} />
    case 'Panel':
      return <Panel actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as PanelWidgetData} />
    case 'Paragraph':
      return <Paragraph actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as ParagraphWidgetData} />
    case 'PieChart':
      return <PieChart actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as PieChartWidgetData} />
    case 'LineChart':
      return <LineChart actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as LineChartWidgetData} />
    case 'BarChart':
      return <BarChart actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as BarChartWidgetData} />
    case 'Row':
      return <Row actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as RowWidgetData} />
    case 'Route':
      return <Route actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as RouteWidgetData} />
    case 'Table':
    {
      const props: TableWidgetData = { ...widgetData as TableWidgetData }
      if (props?.prefix && props?.componentId && props?.data) {
        setData(props.prefix, props.componentId, props.data || [])
        props.data = getFilteredData(props.prefix, props.componentId) as { [k: string]: unknown }[]
      }
      return <Table actions={actions} resourcesRefs={resourcesRefs} widgetData={props} />
    }
    case 'DataGrid':
      return <DataGrid actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as DataGridWidgetData} />
    case 'TabList':
      return <TabList actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as TabListWidgetData} />
    case 'YamlViewer':
      return <YamlViewer actions={actions} resourcesRefs={resourcesRefs} widgetData={widgetData as YamlViewerWidgetData} />
    default:
      throw new Error(`Unknown widget kind: ${kind}`)
  }
}

const WidgetRenderer = ({ prefix, widgetEndpoint }: { widgetEndpoint: string; prefix?: string }) => {
  const navigate = useNavigate()
  const { getFilteredData, isWidgetFilteredByProps, setData } = useFilter()

  if (!widgetEndpoint?.includes('widgets.templates.krateo.io')) {
    console.warn(
      `WidgetRenderer received widgetEndpoint=${widgetEndpoint}, which is probably invalid an url is expected`,
    )
  }

  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.BACKEND_API_BASE_URL}${widgetEndpoint}`

  const {
    data: widget,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(widgetFullUrl, {
        headers: {
          'X-Krateo-Groups': 'admins',
          'X-Krateo-User': 'admin',
        },
      })

      const widget = (await res.json()) as Widget
      return widget
    },
    queryKey: ['widgets', widgetFullUrl],
  })

  // check if widget is filtered out by filters
  if (typeof widget?.status === 'object' && widget?.status?.widgetData) {
    if (prefix) {
      if (isWidgetFilteredByProps(widget.status.widgetData, prefix)) {
        return
      }
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} size='large' spinning />
      </div>
    )
  }

  if (!widget) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget does not exist`}
          title='Error while rendering widget'
        />
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

  if (widget.kind === 'Status' && widget?.code === 500 && widget?.status === 'Failure' && widget?.message?.includes('credentials')) {
    void navigate('/login')
  }

  return parseData(widget, widgetEndpoint, setData, getFilteredData)
}

export default WidgetRenderer
