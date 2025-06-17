import { useQuery } from '@tanstack/react-query'
import { Result, Skeleton } from 'antd'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { Widget } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import BarChart from '../../widgets/BarChart'
import type { BarChartWidgetData } from '../../widgets/BarChart/BarChart'
import Button from '../../widgets/Button'
import type { ButtonWidgetData } from '../../widgets/Button/Button'
import Column from '../../widgets/Column'
import type { ColumnWidgetData } from '../../widgets/Column/Column'
import type { CompositionCardWidgetData } from '../../widgets/CompositionCard/CompositionCard'
import CompositionCard from '../../widgets/CompositionCard/CompositionCard'
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
import type { NavMenuWidgetData } from '../../widgets/NavMenu/NavMenu'
import { NavMenu } from '../../widgets/NavMenu/NavMenu'
import type { PanelWidgetData } from '../../widgets/Panel/Panel'
import Panel from '../../widgets/Panel/Panel'
import Paragraph from '../../widgets/Paragraph'
import type { ParagraphWidgetData } from '../../widgets/Paragraph/Paragraph'
import type { PieChartWidgetData } from '../../widgets/PieChart/PieChart'
import PieChart from '../../widgets/PieChart/PieChart'
import type { ResourceRouteWidgetData } from '../../widgets/ResourceRoute/ResourceRoute'
import { ResourceRoute } from '../../widgets/ResourceRoute/ResourceRoute'
import type { ResourcesRouterWidgetData } from '../../widgets/ResourcesRouter/ResourcesRouter'
import { ResourcesRouter } from '../../widgets/ResourcesRouter/ResourcesRouter'
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

function parseData(widget: Widget, widgetEndpoint: string) {
  const { kind, metadata, spec, status } = widget

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

  // TODO: check if actions should be retrieved from status
  const { actions } = spec
  const { resourcesRefs, widgetData } = status
  const uid = metadata?.uid

  switch (kind) {
    case 'BarChart':
      return <BarChart actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as BarChartWidgetData} />
    case 'Button':
      return <Button actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ButtonWidgetData} />
    case 'Column':
      return <Column actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ColumnWidgetData} />
    case 'CompositionCard':
      return (
        <CompositionCard actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as CompositionCardWidgetData} />
      )
    case 'EventList':
      return <EventList actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as EventListWidgetData} />
    case 'FlowChart':
      return <FlowChart actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FlowChartWidgetData} />
    case 'LineChart':
      return <LineChart actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as LineChartWidgetData} />
    case 'NavMenu':
      return <NavMenu actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as NavMenuWidgetData} />
    case 'Panel':
      return <Panel actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as PanelWidgetData} />
    case 'Paragraph':
      return <Paragraph actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ParagraphWidgetData} />
    case 'PieChart':
      return <PieChart actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as PieChartWidgetData} />
    case 'Row':
      return <Row actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as RowWidgetData} />
    case 'Route':
      return <Route actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as RouteWidgetData} />
    case 'Table':
    {
      return <Table actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as TableWidgetData} />
    }
    case 'DataGrid':
      return <DataGrid actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as DataGridWidgetData} />
    case 'Filters':
      return <Filters actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FiltersWidgetData} />
    case 'TabList':
      return <TabList actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as TabListWidgetData} />
    case 'YamlViewer':
      return <YamlViewer actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as YamlViewerWidgetData} />
    case 'Form':
      return <Form actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as FormWidgetData} />
    case 'ResourcesRouter':
      return (
        <ResourcesRouter actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ResourcesRouterWidgetData} />
      )
    case 'ResourceRoute':
      return <ResourceRoute actions={actions} resourcesRefs={resourcesRefs} uid={uid} widgetData={widgetData as ResourceRouteWidgetData} />
    default:
      throw new Error(`Unknown widget kind: ${kind}`)
  }
}

const WidgetRenderer = ({
  invisible = false,
  prefix,
  widgetEndpoint,
}: {
  prefix?: string
  widgetEndpoint: string
  /* for widget tha don't need to be displayed, usually becuase they just fetch other widgets */
  invisible?: boolean
}) => {
  const navigate = useNavigate()
  const { isWidgetFilteredByProps } = useFilter()

  if (!widgetEndpoint?.includes('widgets.templates.krateo.io')) {
    console.warn(`WidgetRenderer received widgetEndpoint=${widgetEndpoint}, which is probably invalid an url is expected`)
  }

  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${widgetEndpoint}`

  const {
    data: widget,
    error,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(widgetFullUrl, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
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
        return null
      }
    }
  }

  if (invisible) {
    if (widget) {
      return parseData(widget, widgetEndpoint)
    }
    return null
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Skeleton />
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
    void navigate('/login')
  }

  if (widget.kind === 'Status' && widget?.code === 500 && widget?.status === 'Failure' && widget?.message?.includes('credentials')) {
    void navigate('/login')
  }

  return parseData(widget, widgetEndpoint)
}

export default WidgetRenderer
