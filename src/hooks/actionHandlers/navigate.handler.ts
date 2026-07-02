import type { ResourcesRefs, Widget, WidgetAction } from '../../types/Widget'
import type { ActionHandlerContext } from '../useHandleActions'

import { resolveResourceRef } from './utils'

type NavigateAction = Extract<WidgetAction, { type: 'navigate' }>

export const handleNavigateAction = async (
  action: NavigateAction,
  resourcesRefs: ResourcesRefs,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  context: ActionHandlerContext
): Promise<void> => {
  if (action.path) {
    const resolvedPath = action.path.startsWith('${')
      ? await context.resolveJq(action.path, { json: customPayload, widget })
      : action.path

    if (!action.requireConfirmation || window.confirm('Are you sure?')) {
      await context.navigate(resolvedPath)
    }

    context.setIsActionLoading(false)
    return
  }

  const resourceRef = await resolveResourceRef(action.resourceRefId, resourcesRefs, customPayload, widget, context)
  if (!resourceRef) { return }

  const prefix = action.resourceURLPathExtension || context.location.pathname
  const url = `${prefix}?widgetEndpoint=${encodeURIComponent(resourceRef.path)}`

  if (!action.requireConfirmation || window.confirm('Are you sure?')) {
    await context.navigate(url)
  }
}
