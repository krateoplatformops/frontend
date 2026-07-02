import { LoadingOutlined } from '@ant-design/icons'
import type { EventListener, MessageEvent } from 'event-source-polyfill'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { createElement } from 'react'

import type { ResourcesRefs, Widget, WidgetAction } from '../../types/Widget'
import type { EventsApiResource, Payload, RestApiResponse } from '../../utils/types'
import { getHeadersObject } from '../../utils/utils'
import { closeDrawer } from '../../widgets/Drawer/Drawer'
import type { ActionHandlerContext } from '../useHandleActions'

import { buildPayload, interpolateRedirectUrl, resolveResourceRef, updateNameNamespace } from './utils'

type RestAction = Extract<WidgetAction, { type: 'rest' }>

const handleOnEventNavigateTo = async (
  eventConfig: NonNullable<RestAction['onEventNavigateTo']>,
  context: ActionHandlerContext,
  customPayload: Record<string, unknown> | undefined,
  payload: Payload,
  errorMessage: string | undefined,
  successMessage: string | undefined,
  getResourceUid: () => string | null,
  getJsonResponse: () => RestApiResponse | null,
): Promise<void> => {
  let eventReceived = false
  const mode = eventConfig.mode ?? 'navigate'
  const eventsEndpoint = `${context.config!.api.EVENTS_PUSH_API_BASE_URL}/notifications`

  const eventSource = new EventSourcePolyfill(eventsEndpoint, {
    headers: {
      Authorization: `Bearer ${context.accessToken}`,
    },
    withCredentials: false,
  })

  const defaultLoadingMessage = mode === 'notification'
    ? 'Waiting for resource...'
    : 'Waiting for resource and redirecting...'

  const loadingMessage = eventConfig.loadingMessage
    ? await context.resolveJq(eventConfig.loadingMessage, { json: payload, response: getJsonResponse() })
    : defaultLoadingMessage

  const resolveErrorDescription = async () => {
    let description = `Timeout waiting for event ${eventConfig.eventReason}`
    if (errorMessage) {
      description = errorMessage.startsWith('${')
        ? await context.resolveJq(errorMessage, { json: payload, response: getJsonResponse() })
        : errorMessage
    }
    return description
  }

  const resolveRedirectUrl = async (eventData: EventsApiResource) => {
    if (eventConfig.url.startsWith('${')) {
      return context.resolveJq(eventConfig.url, {
        event: eventData as unknown as Record<string, unknown>,
        json: payload,
        response: getJsonResponse(),
      })
    }
    if (customPayload) {
      return interpolateRedirectUrl(customPayload, eventConfig.url)
    }
    return eventConfig.url
  }

  const resolveSuccessDescription = async (eventData: EventsApiResource) => {
    if (successMessage) {
      return successMessage.startsWith('${')
        ? context.resolveJq(successMessage, {
          event: eventData as unknown as Record<string, unknown>,
          json: payload,
          response: getJsonResponse(),
        })
        : successMessage
    }
    return 'The action has been executed successfully'
  }

  if (mode === 'notification') {
    const notificationKey = `event-${eventConfig.eventReason}-${Date.now()}`

    context.setIsActionLoading(false)
    closeDrawer()

    context.notification.info({
      description: loadingMessage,
      duration: 0,
      icon: createElement(LoadingOutlined, { spin: true }),
      key: notificationKey,
      message: 'Action in progress',
      placement: 'topRight',
    })

    const timeoutId = setTimeout(() => {
      void (async () => {
        if (!eventReceived) {
          eventSource.close()
          context.notification.error({
            description: await resolveErrorDescription(),
            duration: 0,
            key: notificationKey,
            message: 'Error while executing the action',
            placement: 'topRight',
          })
        }
      })()
    }, eventConfig.timeout! * 1000)

    eventSource.addEventListener('krateo', ((event: MessageEvent) => {
      const resourceUid = getResourceUid()
      if (!resourceUid) { return }

      const eventData = JSON.parse(event.data as string) as EventsApiResource

      if (eventData.reason === eventConfig.eventReason && eventData.involved_object_uid === resourceUid) {
        eventReceived = true

        if (eventConfig.reloadRoutes !== false) {
          void context.reloadRoutes()
        }

        eventSource.close()
        clearTimeout(timeoutId)

        void (async () => {
          const redirectUrl = await resolveRedirectUrl(eventData)

          if (!redirectUrl) {
            context.notification.error({
              description: 'Impossible to redirect, the route contains an undefined value',
              message: 'Error while redirecting',
              placement: 'bottomLeft',
            })
            return
          }

          context.notification.success({
            description: createElement(
              'span',
              null,
              await resolveSuccessDescription(eventData),
              ' — ',
              createElement(
                'a',
                { href: redirectUrl, onClick: () => { context.notification.destroy(notificationKey) } },
                'Go to resource'
              )
            ),
            duration: 0,
            key: notificationKey,
            message: `Successfully executed action`,
            placement: 'topRight',
          })
        })()
      }
    }) as EventListener)
  } else {
    const timeoutId = setTimeout(() => {
      if (!eventReceived) {
        context.setIsActionLoading(false)
        eventSource.close()
        void (async () => {
          context.notification.error({
            description: await resolveErrorDescription(),
            message: 'Error while executing the action',
            placement: 'bottomLeft',
          })
        })()
      }
      context.message.destroy()
    }, eventConfig.timeout! * 1000)

    context.message.loading(loadingMessage, eventConfig.timeout)

    eventSource.addEventListener('krateo', ((event: MessageEvent) => {
      const resourceUid = getResourceUid()
      if (!resourceUid) { return }

      const eventData = JSON.parse(event.data as string) as EventsApiResource

      if (eventData.reason === eventConfig.eventReason && eventData.involved_object_uid === resourceUid) {
        eventReceived = true

        if (eventConfig.reloadRoutes !== false) {
          void context.reloadRoutes()
        }

        eventSource.close()
        clearTimeout(timeoutId)

        void (async () => {
          const redirectUrl = await resolveRedirectUrl(eventData)

          if (!redirectUrl) {
            context.message.destroy()
            context.notification.error({
              description: 'Impossible to redirect, the route contains an undefined value',
              message: 'Error while redirecting',
              placement: 'bottomLeft',
            })
            return
          }

          context.message.destroy()
          context.notification.success({
            description: await resolveSuccessDescription(eventData),
            message: `Successfully executed action`,
            placement: 'bottomLeft',
          })

          context.setIsActionLoading(false)
          closeDrawer()
          void context.navigate(redirectUrl)
        })()
      }
    }) as EventListener)
  }
}

export const handleRestAction = async (
  action: RestAction,
  resourcesRefs: ResourcesRefs,
  customPayload: Record<string, unknown> | undefined,
  widget: Widget | undefined,
  context: ActionHandlerContext
): Promise<void> => {
  const resourceRef = await resolveResourceRef(action.resourceRefId, resourcesRefs, customPayload, widget, context)
  if (!resourceRef) { return }

  const { path, payload: resourcePayload, verb } = resourceRef
  const url = context.config!.api.SNOWPLOW_API_BASE_URL + path

  const {
    errorMessage,
    headers = [],
    onEventNavigateTo,
    onSuccessNavigateTo,
    requireConfirmation,
    successMessage,
  } = action

  let jsonResponse: RestApiResponse | null = null

  if (!requireConfirmation || window.confirm('Are you sure?')) {
    if (onSuccessNavigateTo && onEventNavigateTo) {
      context.message.destroy()
      context.notification.error({
        description: 'Action has defined both the "onSuccessNavigateTo" and "onEventNavigateTo" properties',
        message: 'Warning while executing the action',
        placement: 'bottomLeft',
      })

      context.setIsActionLoading(false)
      return
    }

    const payload = await buildPayload(action, resourcePayload, customPayload, context.resolveJq)

    let resourceUid: string | null = null

    if (onEventNavigateTo) {
      await handleOnEventNavigateTo(
        onEventNavigateTo,
        context,
        customPayload,
        payload,
        errorMessage,
        successMessage,
        () => resourceUid,
        () => jsonResponse,
      )
    }

    const updatedUrl = customPayload
      ? updateNameNamespace(url, payload?.metadata?.name, payload?.metadata?.namespace)
      : url

    const headersObject = getHeadersObject(headers)
    if (!headersObject) {
      context.message.destroy()
      context.notification.error({
        description: 'Headers are not in the key: value format',
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })
      return
    }

    const requestHeaders = {
      ...headersObject,
      Accept: 'application/json',
      Authorization: `Bearer ${context.accessToken}`,
    }

    const shouldSendPayload = ['POST', 'PUT', 'PATCH'].includes(verb)

    const res = await fetch(updatedUrl, {
      body: shouldSendPayload ? JSON.stringify(payload) : undefined,
      headers: requestHeaders,
      method: verb,
    })

    jsonResponse = (await res.json()) as RestApiResponse

    context.setIsActionLoading(false)

    if (!res.ok) {
      let description = jsonResponse.message

      if (errorMessage) {
        description = errorMessage.startsWith('${')
          ? await context.resolveJq(errorMessage, {
            json: payload,
            response: jsonResponse,
          })
          : errorMessage
      }

      context.message.destroy()
      context.notification.error({
        description,
        message: `${jsonResponse.status} - ${jsonResponse.reason}`,
        placement: 'bottomLeft',
      })
      return
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
          case 'PATCH':
            return 'updated'
          default:
            return 'updated'
        }
      })()

      let description = `Successfully ${actionName} ${jsonResponse.metadata?.name} in ${jsonResponse.metadata?.namespace}`
      if (successMessage) {
        description = successMessage.startsWith('${')
          ? await context.resolveJq(successMessage, { json: payload, response: jsonResponse })
          : successMessage
      }

      context.notification.success({
        description,
        message: jsonResponse.message,
        placement: 'bottomLeft',
      })
    }

    await context.queryClient.invalidateQueries()

    if (onSuccessNavigateTo) {
      closeDrawer()

      const onSuccessUrl = onSuccessNavigateTo.startsWith('${')
        ? await context.resolveJq(onSuccessNavigateTo, { json: payload, response: jsonResponse })
        : onSuccessNavigateTo

      window.location.replace(onSuccessUrl)
    }
  }
}
