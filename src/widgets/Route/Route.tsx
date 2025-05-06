import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router'

import type { WidgetProps } from '../../types/Widget'

export function Route(
  props: WidgetProps<{
    path: string
    icon: string
    label: string
  }>,
) {
  return (
    <div>
      <Link to={props.widgetData.path}>
        <FontAwesomeIcon icon={props.widgetData.icon as IconProp} />
        {props.widgetData.label}
      </Link>
    </div>
  )
}
