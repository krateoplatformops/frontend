/* eslint-disable @typescript-eslint/no-misused-promises */
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useNavigate } from 'react-router'

import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './NavMenu.module.css'

export function NavMenu(
  props: WidgetProps<{
    items: Array<{
      label: string
      icon: string
      path: string
      resourceRefId: string
    }>
  }>,
) {
  const navigate = useNavigate()

  const { items } = props.widgetData

  const menuItems: MenuItemType[] = items.map(({ icon, label, path, resourceRefId }) => {
    const backendEndpoint = getEndpointUrl(resourceRefId, props.resourcesRefs)
    const key = `${path}?widgetEndpoint=${encodeURIComponent(backendEndpoint)}`

    return ({
      icon: <FontAwesomeIcon icon={icon as IconProp} />,
      key,
      label,
    })
  })

  return (
    <Menu
      className={styles.menu}
      items={menuItems}
      mode='inline'
      onClick={item => navigate(item.key)}
    />
  )
}
