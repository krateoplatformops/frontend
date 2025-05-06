import { getResourceEndpoint } from '../utils/utils'

import { WidgetRenderer } from './WidgetRenderer'

export function Sidebar() {
  return (
    <div style={{ backgroundColor: 'pink', width: '200px' }}>
      <h1>Sidebar</h1>

      <WidgetRenderer
        widgetEndpoint={getResourceEndpoint({
          name: 'sidebar-nav-menu',
          namespace: 'krateo-system',
          resource: 'navmenus',
          version: 'v1beta1',
        })}
      />
    </div>
  )
}
