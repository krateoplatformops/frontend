import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router'

import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'

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
    <Link className={styles.route} to={`${props.widgetData.path}?widgetEndpoint=${encodeURIComponent(backendEndpoint)}`}>
      <FontAwesomeIcon icon={props.widgetData.icon as IconProp} />
      <span className={styles.link}>{props.widgetData.label}</span>
    </Link>
  )
}
