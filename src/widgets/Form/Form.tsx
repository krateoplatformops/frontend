import { Button, Result, Space } from 'antd'
import useApp from 'antd/es/app/useApp'
import dayjs from 'dayjs'
import type { JSONSchema4 } from 'json-schema'
import { useEffect, useId, useRef } from 'react'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import { getHeadersObject, getResourceRef } from '../../utils/utils'
import { closeDrawer } from '../Drawer/Drawer'
import { useDrawerContext } from '../Drawer/DrawerContext'

import styles from './Form.module.css'
import type { Form as WidgetType } from './Form.type'
import FormGenerator from './FormGenerator'
import { convertStringToObject, interpolateRedirectUrl, updateNameNamespace } from './utils'

export type FormWidgetData = WidgetType['spec']['widgetData']

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

  // if the form is inside a Drawer, button will be already rendered in the Drawer
  const shouldRenderButtonsInsideForm = !insideDrawer

  return (
    <div className={styles.form}>
      {shouldRenderButtonsInsideForm ? <FormExtra form={formId} /> : null}

      <FormGenerator
        descriptionTooltip={fieldDescription === 'tooltip'}
        formId={formId}
        onSubmit={async (values) => {
          if (action.type !== 'rest') {
            throw new Error('Submit action type is not "rest"')
          }

          if (action.onSuccessNavigateTo && action.onEventNavigateTo) {
            console.warn('submit action has both onSuccessNavigateTo and onEventNavigateTo defined')
          }

          // convert all dayjs date to ISOstring
          Object.keys(values).forEach((key) => {
            if (dayjs.isDayjs(values[key])) {
              values[key] = values[key].toISOString()
            }
          })

          // const formEndpoint = template.template.path
          // const formVerb = template.template.verb
          // const formOverride = template.template.payloadToOverride
          // const formKey = template.template.payloadFormKey || data.status.props.payloadFormKey || 'spec'

          const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

          if (!resourceRef) {
            setDrawerData({ extra: <FormExtra form={formId} /> })
          } else {
            const url = config?.api.SNOWPLOW_API_BASE_URL + resourceRef.path

            const method = resourceRef.verb

            const formKey = action.payloadKey
            let payload = { ...resourceRef.payload, ...values }

            if (action.payloadToOverride && action.payloadToOverride.length > 0) {
              const updateJson = (values: object, keyPath: string, valuePath: string) => {
                const getObjectByPath = (obj: object, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj)

                const substr = valuePath.replace('${', '').replace('}', '')
                const parts = substr.split('+').map((el) => el.trim())

                const value = parts
                  .map((el) => (el.startsWith('"') || el.startsWith("'") ? el.replace(/"/g, '') : getObjectByPath(values, el) || ''))
                  .join('')

                return _.merge({}, values, convertStringToObject(keyPath, value))
              }

              action.payloadToOverride.forEach((el) => {
                payload = updateJson(payload, el.name, el.value)
              })
            }

            /* get all the keys that are not in the resourceRef.payload, basically the form values */
            const valuesKeys = Object.keys(payload).filter((el) => Object.keys(resourceRef.payload).indexOf(el) === -1)
            payload[formKey] = {}
            valuesKeys.forEach((el) => {
              payload[formKey][el] = typeof payload[el] === 'object' && !Array.isArray(payload[el]) ? { ...payload[el] } : payload[el]
              delete payload[el]
            })

            // const urlWithNewNameAndNamespace = new URL(url)
            // urlWithNewNameAndNamespace.searchParams.set('name', payload.metadata.name)
            // urlWithNewNameAndNamespace.searchParams.set('namespace', payload.metadata.namespace)
            // urlWithNewNameAndNamespace.searchParams.set('apiVersion', 'composition.krateo.io/v2-0-0')
            const urlWithNewNameAndNamespace = updateNameNamespace(url, payload.metadata.name, payload.metadata.namespace)

            /* will ne known aftert the http request */
            let resourceUid: string | null = null
            if (action.onEventNavigateTo) {
              /* FIXME: This is a bit dirty, should disable the already present buttons instead */
              setDrawerData({ extra: <FormExtra disabled form={formId} /> })

              const eventsEndpoint = `${config!.api.EVENTS_PUSH_API_BASE_URL}/notifications`
              const eventSource = new EventSource(eventsEndpoint, {
                withCredentials: false,
              })

              const timeoutId = setTimeout(() => {
                eventSource.close()
                notification.error({
                  message: `Timeout waiting for event ${action.onEventNavigateTo!.eventReason}`,
                  placement: 'bottomLeft',
                })
                message.destroy()
              }, action.onEventNavigateTo.timeout! * 1000)

              eventSource.addEventListener('krateo', (event) => {
                const data = JSON.parse(event.data as string) as { reason: string; involvedObject: { uid: string } }
                if (data?.reason === action.onEventNavigateTo?.eventReason && data.involvedObject.uid === resourceUid) {
                  eventSource.close()
                  clearTimeout(timeoutId)

                  const redirectUrl = interpolateRedirectUrl(payload, action.onEventNavigateTo.url)
                  if (!redirectUrl) {
                    notification.error({
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

            const headers = action.headers || []

            const res = await fetch(urlWithNewNameAndNamespace, {
              body: JSON.stringify(payload),
              headers: {
                ...getHeadersObject(headers),
                Authorization: `Bearer ${getAccessToken()}`,
              },
              method,
            })

            if (action.onEventNavigateTo) {
              message.loading('Creating the new resource and redirecting...', action.onEventNavigateTo.timeout)
            }

            // TODO: write this type
            const json = (await res.json()) as { metadata: { uid: string } }

            if (!res.ok) {
              message.destroy()
              notification.error({
                description: action.errorMessage || json.message,
                message: `${json.status} - ${json.reason}`,
                placement: 'bottomLeft',
              })
              return
            }

            resourceUid = json.metadata.uid

            const actionName = method === 'DELETE' ? 'deleted' : 'created'

            /* if we are not waiting for an event, we can show a success message */
            if (!action.onEventNavigateTo) {
              notification.success({
                description: action.successMessage || `Successfully ${actionName} ${json.metadata.name} in ${json.metadata.namespace}`,
                message: json.message,
                placement: 'bottomLeft',
              })
            }

            if (action.onSuccessNavigateTo) {
              setSubmitting(false)
              closeDrawer()
              void navigate(action.onSuccessNavigateTo)
            }

            /* when waiting for event, keeping the drawer open to give
          a UX sense of something in progress while somethign is created instead of instanty navigate to a black  */
            if (!action.onEventNavigateTo) {
              closeDrawer()
            }
          }
        }}
        schema={formSchema}
        showFormStructure={true}
      />
    </div>
  )
}

export default Form
