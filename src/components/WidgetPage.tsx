import { useSearchParams } from 'react-router'

import Sidebar from './Sidebar'
import { WidgetRenderer } from './WidgetRenderer'

export function WidgetPage() {
  const [searchParams] = useSearchParams()
  const widgetEndpoint = searchParams.get('widgetEndpoint')

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        {widgetEndpoint ? (
          <WidgetRenderer widgetEndpoint={widgetEndpoint} />
        ) : (
          <div>No widget endpoint provided in query param widgetEndpoint</div>
        )}
      </div>
    </div>
  )
}
