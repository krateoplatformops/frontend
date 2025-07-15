import { useQueryClient } from '@tanstack/react-query'
import useApp from 'antd/es/app/useApp'
import { merge } from 'lodash'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../context/ConfigContext'
import type { WidgetAction } from '../types/Widget'
import { getAccessToken } from '../utils/getAccessToken'
import type { Payload, RestApiResponse } from '../utils/types'
import { getHeadersObject } from '../utils/utils'
import { closeDrawer, openDrawer } from '../widgets/Drawer/Drawer'
import { openModal } from '../widgets/Modal/Modal'

interface EventData {
  involvedObject: {
    uid: string
  }
  reason: string
}

/**
 * Converts a dotted string path (e.g., "a.b.c") into a nested object structure,
 * assigning the given value to the innermost key.
 *
 * Example:
 *   convertStringToObject("user.name", "Alice")
 *   → { user: { name: "Alice" } }
 *
 * @param dottedString - The dotted path string representing the nested object keys
 * @param value - The value to assign at the final nested key
 * @returns A nested object with the specified value at the correct path
 */
const convertStringToObject = (dottedString: string, value: unknown): Record<string, unknown> => {
  const keys = dottedString.split('.')
  const result: Record<string, unknown> = {}
  let current: Record<string, unknown> = result

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
    } else {
      if (typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {}
      }

      current = current[key] as Record<string, unknown>
    }
  })

  return result
}

/**
 * Retrieves a nested value from an object using a dot-separated path string.
 *
 * The function safely traverses the object structure and returns the value found at the given path.
 * If any segment in the path does not exist or is not an object, it returns `undefined`.
 *
 * Example:
 *   getObjectByPath({ user: { profile: { id: 42 } } }, "user.profile.id")
 *   → 42
 *
 * @param obj - The object to traverse.
 * @param path - A dot-separated string path representing the property to access (e.g., "user.profile.id").
 * @returns The value found at the given path, or `undefined` if the path is invalid.
 */
const getObjectByPath = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (typeof acc === 'object' && acc !== null && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

/**
 * Interpolates a route template using values from a nested payload object.
 * Placeholders in the route must follow the format `${path.to.value}`.
 * If any placeholder cannot be resolved or is not a primitive, the function returns null.
 *
 * Example:
 *   interpolateRedirectUrl({ user: { id: 123 } }, "/profile/${user.id}")
 *   → "/profile/123"
 *
 * @param payload - The object used to resolve placeholders (supports nested values)
 * @param route - The route string containing `${...}` placeholders to be replaced
 * @returns The interpolated route string or null if a placeholder could not be resolved
 */
const interpolateRedirectUrl = (payload: Record<string, unknown>, route: string): string | null => {
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

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint'
      || typeof value === 'symbol') {
      return String(value)
    }

    allReplacementsSuccessful = false
    return ''
  })

  return allReplacementsSuccessful ? interpolatedRoute : null
}

/**
 * Reorganizes the payload by extracting keys that do not exist in the `resourcePayload`
 * and nesting them under a new object keyed by `payloadKey`. All other keys remain at the top level.
 *
 * This is typically used to group newly added form values separately from existing ones.
 *
 * @param {Record<string, unknown>} payload - The original payload, typically from form values.
 * @param {object} resourcePayload - The reference payload to compare against.
 * @param {string | undefined} payloadKey - The key under which to nest the extracted new values.
 * @returns {Record<string, unknown>} - The reorganized payload with extracted values nested under `payloadKey`.
 */
const reorganizePayloadByKey = (payload: Record<string, unknown>, resourcePayload: object, payloadKey: string | undefined): Record<string, unknown> => {
  if (!payloadKey) {
    console.warn('payloadKey is undefined, skipping key reorganization.')
    return payload
  }

  const newPayloadKeyObject: Record<string, unknown> = {}

  const valuesKeys = Object.keys(payload).filter(
    (key) => !Object.prototype.hasOwnProperty.call(resourcePayload, key)
  )

  for (const key of valuesKeys) {
    const value = payload[key]
    newPayloadKeyObject[key]
      = typeof value === 'object' && value !== null && !Array.isArray(value)
        ? { ...value }
        : value
  }

  const cleanedPayload: Record<string, unknown> = {}

  for (const key in payload) {
    if (!valuesKeys.includes(key)) {
      cleanedPayload[key] = payload[key]
    }
  }

  cleanedPayload[payloadKey] = newPayloadKeyObject

  return cleanedPayload
}

/**
 * Updates a nested property in an object at the given key path with a value derived from another path expression.
 *
 * The valuePath can include expressions like: ${user.firstName + " " + user.lastName}
 *
 * @param values - The source object from which to extract values.
 * @param keyPath - Dot-separated path where to set the new value.
 * @param valuePath - A template-style string (e.g., "${user.firstName + ' ' + user.lastName}") used to build the new value.
 * @returns A new object with the updated keyPath set to the interpolated value.
 */
const updateJson = (values: Record<string, unknown>, keyPath: string, valuePath: string): Record<string, unknown> => {
  const substr = valuePath.replace('${', '').replace('}', '')
  const parts = substr.split('+').map((el) => el.trim())

  const value = parts
    .map((el) => {
      if (el.startsWith('"') || el.startsWith("'")) {
        return el.replace(/^['"]|['"]$/g, '')
      }

      const resolved = getObjectByPath(values, el)
      if (typeof resolved === 'string' || typeof resolved === 'number' || typeof resolved === 'boolean'
        || typeof resolved === 'bigint' || typeof resolved === 'symbol') {
        return String(resolved)
      }

      return ''
    })
    .join('')

  return merge({}, values, convertStringToObject(keyPath, value))
}

/**
 * Adds or replaces `name` and `namespace` query parameters in a given URL.
 * Existing `name` and `namespace` parameters (if any) are removed before appending the new values.
 *
 * Example:
 *   updateNameNamespace("/api?foo=bar&name=old", "my-app", "prod")
 *   → "/api?foo=bar&name=my-app&namespace=prod"
 *
 * @param path - The original URL (may already include query parameters)
 * @param name - The new `name` parameter to set
 * @param namespace - The new `namespace` parameter to set
 * @returns The updated URL with the new query parameters
 */
const updateNameNamespace = (path: string, name?: string, namespace?: string) => {
  const qsParameters = path
    .split('?')[1]
    .split('&')
    .filter((el) => el.indexOf('name=') === -1 && el.indexOf('namespace=') === -1)
    .join('&')

  return `${path.split('?')[0]}?${qsParameters}&name=${name}&namespace=${namespace}`
}

export const useHandleAction = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { message, notification } = useApp()
  const { config } = useConfigContext()

  const handleAction = async (
    action: WidgetAction,
    path: string,
    verb?: 'GET' | 'POST' | 'DELETE',
    customPayload?: Record<string, unknown>,
    resourcePayload?: object,
  ) => {
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
      case 'rest': {
        const { errorMessage, headers = [], onEventNavigateTo, onSuccessNavigateTo, payload, payloadKey, payloadToOverride, successMessage } = action

        if (!requireConfirmation || window.confirm('Are you sure?')) {
          if (onSuccessNavigateTo && onEventNavigateTo) {
            notification.error({
              description: 'Submit action has defined both the "onSuccessNavigateTo" and "onEventNavigateTo" properties',
              message: 'Warning submitting form',
              placement: 'bottomLeft',
            })

            return
          }

          let updatedPayload = customPayload ?? {}
          if (payloadToOverride && payloadToOverride.length > 0) {
            payloadToOverride.forEach(({ name, value }) => {
              updatedPayload = updateJson(updatedPayload, name, value)
            })
          }

          if (payloadKey && resourcePayload) {
            updatedPayload = reorganizePayloadByKey(updatedPayload, resourcePayload, payloadKey)
          }

          let resourceUid: string | null = null
          if (onEventNavigateTo) {
            const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}/notifications`

            const eventSource = new EventSource(eventsEndpoint, {
              withCredentials: false,
            })

            const timeoutId = setTimeout(() => {
              eventSource.close()
              notification.error({
                message: `Timeout waiting for event ${onEventNavigateTo.eventReason}`,
                placement: 'bottomLeft',
              })
              message.destroy()
            }, onEventNavigateTo.timeout! * 1000)

            eventSource.addEventListener('krateo', (event) => {
              const data = JSON.parse(event.data as string) as EventData
              if (data.reason === onEventNavigateTo.eventReason && data.involvedObject.uid === resourceUid) {
                eventSource.close()
                clearTimeout(timeoutId)

                const redirectUrl = customPayload && interpolateRedirectUrl(customPayload, onEventNavigateTo.url)
                if (!redirectUrl) {
                  notification.error({
                    description: 'Error while redirecting',
                    message: 'Impossible to redirect, the route contains an undefined value',
                    placement: 'bottomLeft',
                  })
                  return
                }
                message.destroy()
                closeDrawer()
                void navigate(redirectUrl)
              }
            })
          }

          const updatedUrl = customPayload
            ? updateNameNamespace(
              path,
              (updatedPayload as Payload)?.metadata?.name,
              (updatedPayload as Payload)?.metadata?.namespace
            )
            : path

          const res = await fetch(updatedUrl, {
            body: JSON.stringify(updatedPayload || payload),
            headers: {
              ...getHeadersObject(headers),
              Authorization: `Bearer ${getAccessToken()}`,
            },
            method: verb,
          })

          if (onEventNavigateTo) {
            message.loading('Creating the new resource and redirecting...', onEventNavigateTo.timeout)
          }

          const json = (await res.json()) as RestApiResponse

          if (!res.ok) {
            notification.error({
              description: errorMessage || json.message,
              message: `${json.status} - ${json.reason}`,
              placement: 'bottomLeft',
            })
            break
          }

          if (json.metadata?.uid) {
            resourceUid = json.metadata.uid
          }

          if (!onEventNavigateTo) {
            closeDrawer()

            const actionName = verb === 'DELETE' ? 'deleted' : 'created'
            notification.success({
              description: successMessage || `Successfully ${actionName} ${json.metadata?.name} in ${json.metadata?.namespace}`,
              message: json.message,
              placement: 'bottomLeft',
            })
          }

          await queryClient.invalidateQueries()

          if (onSuccessNavigateTo) {
            closeDrawer()
            await navigate(onSuccessNavigateTo)
          }
        }

        break
      }
      default: break
    }
  }

  return { handleAction }
}
