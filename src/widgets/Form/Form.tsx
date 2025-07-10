import { Button, Result, Space } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { JSONSchema4 } from 'json-schema'
import { useEffect, useId, useRef } from 'react'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import type { RestApiResponse } from '../../utils/types'
import { getHeadersObject, getResourceRef } from '../../utils/utils'
import { closeDrawer } from '../Drawer/Drawer'
import { useDrawerContext } from '../Drawer/DrawerContext'

import styles from './Form.module.css'
import type { Form as WidgetType } from './Form.type'
import FormGenerator from './FormGenerator'
import { convertDayjsToISOString, interpolateRedirectUrl, updateJson, updateNameNamespace } from './utils'

export type FormWidgetData = WidgetType['spec']['widgetData']

interface Payload {
  metadata?: {
    name?: string
    namespace?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface EventData {
  involvedObject: {
    uid: string
  }
  reason: string
}

interface FormExtraProps {
  disabled?: boolean | undefined
  form?: string | undefined
}

const FormExtra = ({ disabled = false, form }: FormExtraProps): React.ReactNode => {
  return (
    <Space>
      <Button disabled={disabled} form={form} htmlType='reset' type='default'>
        Reset
      </Button>
      <Button form={form} htmlType='submit' type='primary'>
        Submit
      </Button>
    </Space>
  )
}

const Form = ({ resourcesRefs, widgetData }: WidgetProps<FormWidgetData>) => {
  const { actions, fieldDescription, schema, stringSchema, submitActionId } = widgetData
  const { insideDrawer, setDrawerData } = useDrawerContext()
  const alreadySetDrawerData = useRef(false)
  const navigate = useNavigate()

  const { config } = useConfigContext()
  const { message, notification } = useApp()

  /* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form */
  const formId = useId()

  useEffect(() => {
    if (insideDrawer && !alreadySetDrawerData.current) {
      setDrawerData({ extra: <FormExtra form={formId} /> })
      alreadySetDrawerData.current = true
    }
  }, [formId, insideDrawer, setDrawerData])

  const action = Object.values(actions)
    .flat()
    .find(({ id }) => id === submitActionId)

  if (!action) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget definition does not include an action with the ID ${submitActionId}`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

  if (!schema && !stringSchema) {
    return (
      <div className={styles.message}>
        <Result
          status='error'
          subTitle={`The widget definition does not include a schema or stringSchema for Form fields`}
          title='Error while rendering widget'
        />
      </div>
    )
  }

  const formSchema = (stringSchema ? JSON.parse(stringSchema) : schema) as JSONSchema4

  // If the form is inside a Drawer, button will be already rendered in the Drawer
  const shouldRenderButtonsInsideForm = !insideDrawer

  const onSubmit = async (formValues: object) => {
    if (action.type !== 'rest') {
      notification.error({
        description: 'Submit action type is not "rest"',
        message: 'Error submitting form',
        placement: 'bottomLeft',
      })

      return
    }

    const {
      errorMessage,
      headers = [],
      onEventNavigateTo,
      onSuccessNavigateTo,
      payloadKey,
      payloadToOverride,
      successMessage,
    } = action

    if (onSuccessNavigateTo && onEventNavigateTo) {
      notification.warning({
        description: 'Submit action has defined both the "onSuccessNavigateTo" and "onEventNavigateTo" properties',
        message: 'Warning submitting form',
        placement: 'bottomLeft',
      })
    }

    const values = convertDayjsToISOString(formValues)

    if (!resourceRef) {
      setDrawerData({ extra: <FormExtra form={formId} /> })
    } else {
      const { path, payload: resourcePayload, verb } = resourceRef

      const url = config?.api.SNOWPLOW_API_BASE_URL + path

      let payload: Payload = { ...resourcePayload, ...values }

      if (payloadToOverride && payloadToOverride.length > 0) {
        payloadToOverride.forEach(({ name, value }) => {
          payload = updateJson(payload, name, value)
        })
      }

      /* Gets all the keys that are not in the resourceRef.payload, basically the form values */
      if (payloadKey) {
        const newPayloadKeyObject: Record<string, unknown> = {}

        const valuesKeys = Object.keys(payload).filter(
          (key) => !Object.prototype.hasOwnProperty.call(resourcePayload, key)
        )

        for (const key of valuesKeys) {
          const value = (payload as Record<string, unknown>)[key]
          newPayloadKeyObject[key] = typeof value === 'object' && value !== null && !Array.isArray(value)
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
        payload = cleanedPayload
      } else {
        console.warn('payloadKey is undefined, skipping key reorganization.')
      }

      /* Will be known aftert the http request */
      let resourceUid: string | null = null
      if (onEventNavigateTo) {
        /* FIXME: This is a bit dirty, should disable the already present buttons instead */
        setDrawerData({ extra: <FormExtra disabled form={formId} /> })

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
          if (data?.reason === onEventNavigateTo.eventReason && data.involvedObject.uid === resourceUid) {
            eventSource.close()
            clearTimeout(timeoutId)

            const redirectUrl = interpolateRedirectUrl(payload, onEventNavigateTo.url)
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

      const urlWithNewNameAndNamespace = updateNameNamespace(url, payload?.metadata?.name, payload?.metadata?.namespace)

      const res = await fetch(urlWithNewNameAndNamespace, {
        body: JSON.stringify(payload),
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
        message.destroy()
        notification.error({
          description: errorMessage || json.message,
          message: `${json.status} - ${json.reason}`,
          placement: 'bottomLeft',
        })
      }

      if (json.metadata?.uid) {
        resourceUid = json.metadata.uid
      }

      const actionName = verb === 'DELETE' ? 'deleted' : 'created'

      /* If we are not waiting for an event, we can show a success message */
      if (!onEventNavigateTo) {
        closeDrawer()
        notification.success({
          description: successMessage || `Successfully ${actionName} ${json?.metadata?.name} in ${json?.metadata?.namespace}`,
          message: json.message,
          placement: 'bottomLeft',
        })
      }

      if (onSuccessNavigateTo) {
        closeDrawer()
        void navigate(onSuccessNavigateTo)
      }
    }
  }

  return (
    <div className={styles.form}>
      {shouldRenderButtonsInsideForm ? <FormExtra form={formId} /> : null}

      <FormGenerator
        descriptionTooltip={fieldDescription === 'tooltip'}
        formId={formId}
        onSubmit={values => onSubmit(values)}
        schema={formSchema}
        showFormStructure={true}
      />
    </div>
  )
}

export default Form
