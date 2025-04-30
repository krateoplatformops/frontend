import { Drawer } from '../../Drawer'
import { WidgetRenderer } from '../WidgetRenderer'

const Page: React.FC = () => {
  const widgetEndpoint = `/call?resource=buttonwithactions&apiVersion=widgets.templates.krateo.io/v1beta1&name=button-with-open-drawer&namespace=krateo-system`
  return (
    <>
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
    </>
  )
}

export default Page
