import type { ResourcesRefs, Widget, WidgetAction } from '../../types/Widget'
import { openModal } from '../../widgets/Modal/Modal'
import type { ActionHandlerContext } from '../useHandleActions'

import { resolveResourceRef } from './utils'

type OpenModalAction = Extract<WidgetAction, { type: 'openModal' }>

export const handleOpenModalAction = async (
  action: OpenModalAction,
  resourcesRefs: ResourcesRefs,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  context: ActionHandlerContext
): Promise<void> => {
  const resourceRef = await resolveResourceRef(action.resourceRefId, resourcesRefs, customPayload, widget, context)
  if (!resourceRef) { return }

  const { customWidth, size, title } = action

  let modalTitle: string | undefined
  if (title) {
    modalTitle = title.startsWith('${')
      ? await context.resolveJq(title, { json: customPayload, widget })
      : title
  }

  context.setIsActionLoading(false)
  openModal({ customWidth, size, title: modalTitle, widgetEndpoint: resourceRef.path })
}
