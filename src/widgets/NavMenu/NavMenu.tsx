/* eslint-disable @typescript-eslint/no-misused-promises */
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useNavigate } from 'react-router'

import type { WidgetProps } from '../../types/Widget'

export function NavMenu(
  props: WidgetProps<{
    items: Array<{
      label: string
      icon: string
      resourceRefId: string
    }>
  }>,
) {
  const navigate = useNavigate()

  const { items } = props.widgetData
  const menuItems: MenuItemType[] = items.map(({ icon, label, resourceRefId }) => ({ icon, key: resourceRefId, label }))

  return (
    <Menu
      items={menuItems}
      onClick={item => navigate(item.key)}
    />
  )
}
