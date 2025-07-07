import type { WidgetAction } from '../types/Widget'
import { openDrawer } from '../widgets/Drawer/Drawer'
import { openModal } from '../widgets/Modal/Modal'

export const handleAction = (action: WidgetAction, path: string) => {
  const { type } = action

  switch (type) {
    case 'openDrawer': {
      const { size, title } = action

      openDrawer({ size, title, widgetEndpoint: path })

      break
    }
    case 'openModal': {
      const { title } = action

      openModal({ title, widgetEndpoint: path })

      break
    }
  }
}
