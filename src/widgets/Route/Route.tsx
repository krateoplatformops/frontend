import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router'

import type { WidgetProps } from '../../types/Widget'
import { getResourceEndpoint } from '../../utils/utils'

export function Route(
  props: WidgetProps<{
    path: string
    icon: string
    label: string
    resourceRefId: string
  }>,
) {
  const backendEndpoint = getEndpointUrl(props.widgetData.resourceRefId, props.resourcesRefs)
  return (
    <div>
      <Link to={`${props.widgetData.path}?widgetEndpoint=${encodeURIComponent(backendEndpoint)}`}>
        <FontAwesomeIcon icon={props.widgetData.icon as IconProp} />
        {props.widgetData.label}
      </Link>
    </div>
  )
}
