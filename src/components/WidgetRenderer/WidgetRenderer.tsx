import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { Widget } from '../../types/Widget'
import Button from '../../widgets/Button'

import styles from './WidgetRenderer.module.css'

function parseData(widget: Widget, widgetEndpoint: string) {
  const { kind, spec, status } = widget

  if (!status) {
    return `no status for ${kind} widget`
  }

  switch (kind) {
    case 'Status': {
      const params = new URLSearchParams(widgetEndpoint)

      // TODO: handle error
      return (
        <div style={{ border: '1px solid red', margin: '10px' }}>
          ERROR
          <div>name: {params.get('name')}</div>
          <div>namespace: {params.get('namespace')}</div>
          <div>version: {params.get('apiVersion')}</div>
          <div>
            <pre style={{ whiteSpace: 'wrap' }}>
              {JSON.stringify(widget, null, 2)}
            </pre>
            <pre style={{ whiteSpace: 'wrap' }}>endpoint:{widgetEndpoint}</pre>
          </div>
        </div>
      )
    }
    case 'Button':
    case 'ButtonWithAction':
      return (
        <Button
          actions={widget.spec.actions}
          resourcesRefs={widget.status.resourcesRefs}
          widgetData={
            widget.status.widgetData as ButtonSchema['status']['widgetData']
          }
        />
      )
    // case 'Column':
    //   return (
    //     <Column
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'EventList':
    //   return (
    //     <EventList
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Form':
    //   return <Form widgetData={widget.status.widgetData} />
    // case 'NavMenu':
    //   return (
    //     <NavMenu
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Panel':
    //   return (
    //     <Panel
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Paragraph':
    //   return (
    //     <Paragraph widgetData={widget.status.widgetData} />
    //   )
    // case 'PieChart':
    //   return (
    //     <PieChart
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'LineChart':
    //   return (
    //     <LineChart
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Row':
    //   return (
    //     <Row
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Route':
    //   return (
    //     <Route
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'Table':
    //   return (
    //     <Table
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'TabList':
    //   return (
    //     <TabList
    //       resourcesRefs={widget.status.resourcesRefs}
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    // case 'YamlViewer':
    //   return (
    //     <YamlViewer
    //       widgetData={widget.status.widgetData}
    //     />
    //   )
    default:
      throw new Error(`Unknown widget kind: ${widget.kind}`)
  }
}

const WidgetRenderer = ({ widgetEndpoint }: { widgetEndpoint: string }) => {
  const navigate = useNavigate()

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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} size='large' spinning />
      </div>
    )
  }

  if (!widget) {
    return null
  }

  // TODO: handle error
  if (error) {
    console.error(error)
    return <div>...error</div>
  }

  const { code, kind, message, status } = widget

  if (kind === 'Status' && code === 500 && status === 'Failure' && message?.includes('credentials')) {
    void navigate('/login')
  }

  return parseData(widget, widgetEndpoint)
}

export default WidgetRenderer
