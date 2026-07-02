import type { ResourcesRefs, Widget, WidgetAction } from '../../types/Widget'
import { openDrawer } from '../../widgets/Drawer/Drawer'
import type { ActionHandlerContext } from '../useHandleActions'

import { resolveResourceRef } from './utils'

type OpenDrawerAction = Extract<WidgetAction, { type: 'openDrawer' }>

export const handleOpenDrawerAction = async (
  action: OpenDrawerAction,
  resourcesRefs: ResourcesRefs,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  context: ActionHandlerContext
): Promise<void> => {
  const resourceRef = await resolveResourceRef(action.resourceRefId, resourcesRefs, customPayload, widget, context)
  if (!resourceRef) { return }

  const { size, title } = action

  let drawerTitle: string | undefined
  if (title) {
    drawerTitle = title.startsWith('${')
      ? await context.resolveJq(title, { json: customPayload, widget })
      : title
  }

  context.setIsActionLoading(false)
  openDrawer({ size, title: drawerTitle, widgetEndpoint: resourceRef.path })
}
