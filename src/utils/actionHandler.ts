import { useNavigate } from 'react-router'

import type { WidgetAction } from '../types/Widget'
import { openDrawer } from '../widgets/Drawer/Drawer'
import { openModal } from '../widgets/Modal/Modal'

export const handleAction = async (action: WidgetAction, path: string) => {
  const navigate = useNavigate()
  const { requireConfirmation, type } = action

  switch (type) {
    case 'navigate':
      if (!requireConfirmation || window.confirm('Are you sure?')) {
        await navigate(path)
      }

      break
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
