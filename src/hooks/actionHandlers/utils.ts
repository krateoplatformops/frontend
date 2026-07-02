import { merge, set } from 'lodash'

import type { ResourceRef, ResourcesRefs, Widget, WidgetAction } from '../../types/Widget'
import type { Payload } from '../../utils/types'
import { getResourceRef } from '../../utils/utils'
import type { ActionHandlerContext } from '../useHandleActions'

type RestAction = Extract<WidgetAction, { type: 'rest' }>

/**
 * Interpolates a route template using values from a nested payload object.
 * Placeholders must follow the format `${path.to.value}`.
 * Returns null if any placeholder cannot be resolved or is not a primitive.
 */
export const interpolateRedirectUrl = (payload: Record<string, unknown>, route: string): string | null => {
  let allReplacementsSuccessful = true

  const interpolatedRoute = route.replace(/\$\{([^}]+)\}/g, (_, key: string) => {
    const parts = key.split('.')

    let value: unknown = payload
    for (const part of parts) {
      if (typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, part)) {
        value = (value as Record<string, unknown>)[part]
      } else {
        value = undefined
        break
      }
    }

    if (
      typeof value === 'string'
      || typeof value === 'number'
      || typeof value === 'boolean'
      || typeof value === 'bigint'
      || typeof value === 'symbol'
    ) {
      return String(value)
    }

    allReplacementsSuccessful = false
    return ''
  })

  return allReplacementsSuccessful ? interpolatedRoute : null
}

/**
 * Adds or replaces `name` and `namespace` query parameters in a URL.
 */
export const updateNameNamespace = (path: string, name?: string, namespace?: string) => {
  const [base, queryString = ''] = path.split('?')
  const qsParameters = queryString
    .split('&')
    .filter((el) => !el.startsWith('name=') && !el.startsWith('namespace='))
    .join('&')

  return `${base}?${qsParameters ? `${qsParameters}&` : ''}name=${name}&namespace=${namespace}`
}

export const buildPayload = async (
  action: RestAction,
  resourcePayload: object,
  customPayload: Record<string, unknown> | undefined,
  resolveJq: ActionHandlerContext['resolveJq']
): Promise<Payload> => {
  const { payload, payloadToOverride } = action
  let finalPayload = payload ?? {}

  finalPayload = merge({}, payload, resourcePayload)

  if (payloadToOverride && payloadToOverride.length > 0 && customPayload) {
    const overridePromises = payloadToOverride.map(async ({ name, value }) => {
      let resolvedValue: unknown = value

      if (typeof value === 'string' && value.startsWith('${')) {
        resolvedValue = await resolveJq(value, { json: customPayload })
      }

      return { name, resolvedValue }
    })

    const resolvedOverrides = await Promise.all(overridePromises)

    for (const { name, resolvedValue } of resolvedOverrides) {
      set(finalPayload, name, resolvedValue)
    }
  }

  return finalPayload
}

/**
 * Resolves a resourceRefId (optionally a JQ expression) against resourcesRefs.
 * Shows an error notification and returns null if the ref cannot be found.
 */
export const resolveResourceRef = async (
  resourceRefId: string | undefined,
  resourcesRefs: ResourcesRefs,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  ctx: Pick<ActionHandlerContext, 'message' | 'notification' | 'resolveJq'>
): Promise<ResourceRef | null> => {
  let resolvedId: string | undefined

  if (resourceRefId) {
    resolvedId = resourceRefId.startsWith('${')
      ? await ctx.resolveJq(resourceRefId, { json: customPayload, widget })
      : resourceRefId
  }

  const resourceRef = resolvedId ? getResourceRef(resolvedId, resourcesRefs) : undefined

  if (!resourceRef) {
    ctx.message.destroy()
    ctx.notification.error({
      description: `The widget definition does not include a resource reference for resource (ID: ${resolvedId})`,
      message: 'Error while executing the action',
      placement: 'bottomLeft',
    })
    return null
  }

  return resourceRef
}
