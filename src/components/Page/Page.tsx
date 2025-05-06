import { Drawer } from '../../Drawer'
import { Sidebar } from '../Sidebar'
import { WidgetRenderer } from '../WidgetRenderer'

const Page: React.FC = () => {
  const widgetEndpoint = `/call?resource=buttonwithactions&apiVersion=widgets.templates.krateo.io/v1beta1&name=button-with-open-drawer&namespace=krateo-system`

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Drawer />
        <WidgetRenderer widgetEndpoint={widgetEndpoint} />
        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=buttonwithactions&apiVersion=widgets.templates.krateo.io/v1beta1&name=button-with-action&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=columns&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-column&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=panels&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-panel&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=piecharts&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-pie-chart&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=tables&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-table&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=buttons&apiVersion=widgets.templates.krateo.io/v1beta1&name=button-with-api&namespace=krateo-system'
          }
        />

        <WidgetRenderer
          widgetEndpoint={
            '/call?resource=tables&apiVersion=widgets.templates.krateo.io/v1beta1&name=table-of-namespaces&namespace=krateo-system'
          }
        />
      </div>
    </div>
  )
}

export default Page
