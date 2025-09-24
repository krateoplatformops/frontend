import { useQueryClient } from '@tanstack/react-query'
import useApp from 'antd/es/app/useApp'
import { merge } from 'lodash'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { useConfigContext } from '../context/ConfigContext'
import { useRoutesContext } from '../context/RoutesContext'
import type { ResourcesRefs, Widget, WidgetAction } from '../types/Widget'
import { formatMessage } from '../utils/format-message/formatMessage'
import { getAccessToken } from '../utils/getAccessToken'
import { useResolveJqExpression } from '../utils/jq-expression'
import type { Payload, RestApiResponse } from '../utils/types'
import { getHeadersObject, getResourceRef } from '../utils/utils'
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
  return path
    .replace(/^\./, '')
    .split('.').reduce<unknown>((acc, part) => {
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
const reorganizePayloadByKey = (
  payload: Record<string, unknown>,
  resourcePayload: object,
  payloadKey: string | undefined
): Record<string, unknown> => {
  if (!payloadKey) {
    console.warn('payloadKey is undefined, skipping key reorganization.')
    return payload
  }

  const newPayloadKeyObject: Record<string, unknown> = {}

  const valuesKeys = Object.keys(payload).filter((key) => !Object.prototype.hasOwnProperty.call(resourcePayload, key))

  for (const key of valuesKeys) {
    const value = payload[key]
    newPayloadKeyObject[key] = typeof value === 'object' && value !== null && !Array.isArray(value) ? { ...value } : value
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
      if (
        typeof resolved === 'string'
        || typeof resolved === 'number'
        || typeof resolved === 'boolean'
        || typeof resolved === 'bigint'
        || typeof resolved === 'symbol'
      ) {
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
  const location = useLocation()
  const queryClient = useQueryClient()
  const { message, notification } = useApp()
  const { config } = useConfigContext()
  const { reloadRoutes } = useRoutesContext()
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
  const resolveJq = useResolveJqExpression()

  const handleNavigate = async (requireConfirmation: boolean | undefined, path: string) => {
    if (!requireConfirmation || window.confirm('Are you sure?')) {
      await navigate(path)
    }
  }

  const handleAction = async (
    action: WidgetAction,
    resourcesRefs: ResourcesRefs,
    customPayload?: Record<string, unknown>,
    widget?: Widget
  ) => {
    if (action.loading?.display) {
      setIsActionLoading(true)
    }

    if (action.type === 'navigate' && action.path) {
      const updatedUrl = action.path.startsWith('${')
        ? await resolveJq(action.path, { widget })
        : action.path

      await handleNavigate(action.requireConfirmation, updatedUrl)
      setIsActionLoading(false)

      return
    }

    const resourceRef = action.resourceRefId ? getResourceRef(action.resourceRefId, resourcesRefs) : undefined

    if (!resourceRef) {
      message.destroy()
      notification.error({
        description: `The widget definition does not include a resource reference for resource (ID: ${action.resourceRefId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    const { path, payload: resourcePayload, verb } = resourceRef

    let url: string
    if (action.type === 'navigate') {
      url = `${location.pathname}?widgetEndpoint=${encodeURIComponent(path)}`
    } else {
      url = config?.api.SNOWPLOW_API_BASE_URL + path
    }

    try {
      const { requireConfirmation, type } = action

      switch (type) {
        case 'navigate':
          await handleNavigate(requireConfirmation, url)

          break
        case 'openDrawer': {
          const { size, title } = action

          setIsActionLoading(false)
          openDrawer({ size, title, widgetEndpoint: path })

          break
        }
        case 'openModal': {
          const { customWidth, size, title } = action

          setIsActionLoading(false)
          openModal({ customWidth, size, title, widgetEndpoint: path })

          break
        }
        case 'rest': {
          const {
            errorMessage,
            headers = [],
            onEventNavigateTo,
            onSuccessNavigateTo,
            payload,
            payloadKey,
            payloadToOverride,
            successMessage,
          } = action

          let jsonResponse: RestApiResponse | null = null

          if (!requireConfirmation || window.confirm('Are you sure?')) {
            if (onSuccessNavigateTo && onEventNavigateTo) {
              message.destroy()
              notification.error({
                description: 'Action has defined both the "onSuccessNavigateTo" and "onEventNavigateTo" properties',
                message: 'Warning while executing the action',
                placement: 'bottomLeft',
              })

              setIsActionLoading(false)

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
            let eventReceived = false
            if (onEventNavigateTo) {
              const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}/notifications`

              const eventSource = new EventSource(eventsEndpoint, {
                withCredentials: false,
              })

              let description = `Timeout waiting for event ${onEventNavigateTo.eventReason}`
              // eslint-disable-next-line max-depth
              if (errorMessage && errorMessage.startsWith('${')) {
                description = await resolveJq(errorMessage, {
                  json: updatedPayload,
                  response: jsonResponse,
                })
              }

              const timeoutId = setTimeout(() => {
                if (!eventReceived) {
                  setIsActionLoading(false)
                  eventSource.close()
                  notification.error({
                    description,
                    message: 'Error while executing the action',
                    placement: 'bottomLeft',
                  })
                }
                message.destroy()
              }, onEventNavigateTo.timeout! * 1000)

              const loadingMessage = onEventNavigateTo.loadingMessage
                ? await resolveJq(onEventNavigateTo.loadingMessage, { json: updatedPayload, response: jsonResponse })
                : 'Waiting for resource and redirecting...'

              message.loading(loadingMessage, onEventNavigateTo.timeout)

              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              eventSource.addEventListener('krateo', async (event) => {
                if (!resourceUid) {
                  return
                }

                const eventData = JSON.parse(event.data as string) as EventData
                if (eventData.reason === onEventNavigateTo.eventReason && eventData.involvedObject.uid === resourceUid) {
                  eventReceived = true

                  if (onEventNavigateTo.reloadRoutes !== false) {
                    void reloadRoutes()
                  }

                  eventSource.close()
                  clearTimeout(timeoutId)

                  const redirectUrl = await (async () => {
                    /* if it starts with ${ should be resolved by cassing JQ endpoint otherwise use legacy method */
                    if (onEventNavigateTo.url.startsWith('${')) {
                      return resolveJq(onEventNavigateTo.url, {
                        event: eventData as unknown as Record<string, unknown>,
                        json: updatedPayload,
                        response: jsonResponse,
                      })
                    }

                    if (customPayload) {
                      const url = interpolateRedirectUrl(customPayload, onEventNavigateTo.url)
                      return url
                    }

                    return onEventNavigateTo.url
                  })()

                  if (!redirectUrl) {
                    message.destroy()
                    notification.error({
                      description: 'Impossible to redirect, the route contains an undefined value',
                      message: 'Error while redirecting',
                      placement: 'bottomLeft',
                    })

                    return
                  }

                  let description = 'The action has been executed successfully'
                  if (successMessage && successMessage.startsWith('${')) {
                    description = await resolveJq(successMessage, {
                      event: eventData as unknown as Record<string, unknown>,
                      json: updatedPayload,
                      response: jsonResponse,
                    })
                  }

                  message.destroy()
                  notification.success({
                    description,
                    message: `Successfully executed action`,
                    placement: 'bottomLeft',
                  })

                  setIsActionLoading(false)
                  closeDrawer()
                  void navigate(redirectUrl)
                }
              })
            }

            const updatedUrl = customPayload
              ? updateNameNamespace(url, (updatedPayload as Payload)?.metadata?.name, (updatedPayload as Payload)?.metadata?.namespace)
              : url

            const requestBody = Object.keys(updatedPayload).length > 0 ? updatedPayload : payload
            const requestHeaders = {
              ...getHeadersObject(headers),
              Accept: 'application/json',
              Authorization: `Bearer ${getAccessToken()}`,
            }

            const shouldSendPayload = ['POST', 'PUT', 'PATCH'].includes(verb)

            const res = await fetch(updatedUrl, {
              body: shouldSendPayload ? JSON.stringify(requestBody) : undefined,
              headers: requestHeaders,
              method: verb,
            })

            // eslint-disable-next-line require-atomic-updates
            jsonResponse = (await res.json()) as RestApiResponse

            setIsActionLoading(false)

            if (!res.ok) {
              message.destroy()
              notification.error({
                description: errorMessage
                  ? formatMessage(errorMessage, { json: updatedPayload, response: jsonResponse })
                  : jsonResponse.message,
                message: `${jsonResponse.status} - ${jsonResponse.reason}`,
                placement: 'bottomLeft',
              })
              break
            }

            if (jsonResponse.metadata?.uid) {
              resourceUid = jsonResponse.metadata.uid
            }

            if (!onEventNavigateTo) {
              closeDrawer()

              const actionName = (() => {
                switch (verb) {
                  case 'DELETE':
                    return 'deleted'
                  case 'POST':
                    return 'created'
                  case 'PUT':
                    return 'updated'
                  case 'PATCH':
                    return 'updated'
                  default:
                    return 'updated'
                }
              })()

              let description = `Successfully ${actionName} ${jsonResponse.metadata?.name} in ${jsonResponse.metadata?.namespace}`
              // eslint-disable-next-line max-depth
              if (successMessage && successMessage.startsWith('${')) {
                description = await resolveJq(successMessage, {
                  json: updatedPayload,
                  response: jsonResponse,
                })
              }

              notification.success({
                description,
                message: jsonResponse.message,
                placement: 'bottomLeft',
              })
            }

            await queryClient.invalidateQueries()

            if (onSuccessNavigateTo) {
              closeDrawer()
              window.location.replace(onSuccessNavigateTo)
            }
          }

          break
        }
        default:
          break
      }
    } catch (error) {
      message.destroy()
      notification.error({
        description: `Unhandled error: ${JSON.stringify(error)}`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  return { handleAction, isActionLoading }
}
