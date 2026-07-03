import type { Widget, WidgetAction } from '../../types/Widget'
import type { ActionHandlerContext } from '../useHandleActions'

type ExternalNavigateAction = Extract<WidgetAction, { type: 'externalNavigate' }>

export const handleExternalNavigateAction = async (
  action: ExternalNavigateAction,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  context: ActionHandlerContext
): Promise<void> => {
  const resolvedUrl = action.url.startsWith('${')
    ? await context.resolveJq(action.url, { json: customPayload, widget })
    : action.url

  if (!action.requireConfirmation || window.confirm('Are you sure?')) {
    window.open(resolvedUrl, action.target ?? '_blank')
  }

  context.setIsActionLoading(false)
}
