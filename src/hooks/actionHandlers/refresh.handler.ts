import type { ResourcesRefs, WidgetAction } from '../../types/Widget'
import type { ActionHandlerContext } from '../useHandleActions'

type RefreshAction = Extract<WidgetAction, { type: 'refresh' }>

export const handleRefreshAction = async (
  action: RefreshAction,
  resourcesRefs: ResourcesRefs,
  context: ActionHandlerContext
): Promise<void> => {
  if (action.requireConfirmation && !window.confirm('Are you sure?')) {
    context.setIsActionLoading(false)
    return
  }

  const hasScoped = (action.resourcesRefsIds?.length ?? 0) > 0 || (action.widgetKinds?.length ?? 0) > 0

  if (action.resourcesRefsIds?.length) {
    await Promise.all(
      action.resourcesRefsIds.map(id => {
        const ref = resourcesRefs.items.find(item => item.id === id)

        if (!ref) {
          return Promise.resolve()
        }

        return context.queryClient.invalidateQueries({ queryKey: ['widgets', ref.path] })
      })
    )
  }

  if (action.widgetKinds?.length) {
    const resourceNames = action.widgetKinds.map(kind => `resource=${kind.toLowerCase()}s`)

    await context.queryClient.invalidateQueries({
      predicate: query =>
        query.queryKey[0] === 'widgets'
        && typeof query.queryKey[1] === 'string'
        && resourceNames.some(name => (query.queryKey[1] as string).includes(name)),
    })
  }

  if (!hasScoped) {
    await context.queryClient.invalidateQueries()
  }

  context.setIsActionLoading(false)
}
