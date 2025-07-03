import { Button, Result, Space } from 'antd'
import useApp from 'antd/es/app/useApp'
import dayjs from 'dayjs'
import type { JSONSchema4 } from 'json-schema'
import _ from 'lodash'
import { useEffect, useId, useRef, useState } from 'react'
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

export type FormWidgetData = WidgetType['spec']['widgetData']

function Form({ resourcesRefs, widgetData }: WidgetProps<FormWidgetData>) {
  const { actions, submitActionId } = widgetData
  const drawerContext = useDrawerContext()
  const alreadySetDrawerData = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const { config } = useConfigContext()
  const { message, notification } = useApp()

  const formId = useId() /* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form */

  useEffect(() => {
    if (drawerContext.insideDrawer && !alreadySetDrawerData.current) {
      drawerContext.setDrawerData({
        extra: (
          <Space>
            <Button form={formId} htmlType='reset' type='default'>
              Reset
            </Button>
            <Button form={formId} htmlType='submit' type='primary'>
              Submit
            </Button>
          </Space>
        ),
      })
      alreadySetDrawerData.current = true
    }
  }, [drawerContext, drawerContext.insideDrawer, formId])

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

  if (action.type === 'rest' && action.onSuccessNavigateTo && action.onEventNavigateTo) {
    console.warn('submit action has both onSuccessNavigateTo and onEventNavigateTo defined')
  }

  /* if the form is inside a Drawer, button will be already rendered in the Drawer  */
  const shouldRenderButtonsInsideForm = !drawerContext.insideDrawer

  if (!widgetData.schema && !widgetData.stringSchema) {
    throw new Error('received no widgetData.schema or widgetData.stringSchema')
  }

  const schema = (widgetData.stringSchema ? JSON.parse(widgetData.stringSchema) : widgetData.schema) as JSONSchema4

  return (
    <div style={{ height: '100%', maxHeight: '100%' }}>
      {shouldRenderButtonsInsideForm ? (
        <Space>
          <Button form={formId} htmlType='reset' type='default'>
            Reset
          </Button>
          <Button form={formId} htmlType='submit' type='primary'>
            Submit
          </Button>
        </Space>
      ) : null}

      <FormGenerator
        descriptionTooltip={widgetData.fieldDescription === 'tooltip'}
        formId={formId}
        onSubmit={async (values) => {
          if (action.type !== 'rest') {
            throw new Error('Submit action type is not "rest"')
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
            drawerContext.setDrawerData({
              extra: (
                <Space>
                  <Button disabled form={formId} htmlType='reset' type='default'>
                    Reset
                  </Button>
                  <Button disabled form={formId} htmlType='submit' type='primary'>
                    Submit
                  </Button>
                </Space>
              ),
            })
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
              drawerContext.setDrawerData({
                extra: (
                  <Space>
                    <Button disabled form={formId} htmlType='reset' type='default'>
                      Reset
                    </Button>
                    <Button disabled form={formId} htmlType='submit' type='primary'>
                      Submit
                    </Button>
                  </Space>
                ),
              })

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

            setSubmitting(true)
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
              setSubmitting(false)
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
        schema={schema}
        showFormStructure={true}
      />
      {/* <pre>{JSON.stringify(widgetData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(actions, null, 2)}</pre> */}
    </div>
  )
}

function convertStringToObject(dottedString: string, value: unknown) {
  const keys = dottedString.split('.')
  const result = {}
  let current = result

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
    } else {
      current[key] = {}
      current = current[key]
    }
  })

  return result
}

const updateNameNamespace = (path, name, namespace) => {
  // add name and namespace on endpoint querystring from payload.metadata
  const qsParameters = path
    .split('?')[1]
    .split('&')
    .filter((el) => el.indexOf('name=') === -1 && el.indexOf('namespace=') === -1)
    .join('&')
  return `${path.split('?')[0]}?${qsParameters}&name=${name}&namespace=${namespace}`
}

function interpolateRedirectUrl(payload: object, route: string): string | null {
  let allReplacementsSuccessful = true

  const interpolatedRoute = route.replace(/\$\{([^}]+)\}/g, (_, key) => {
    const value = key.split('.').reduce((acc: any, part) => acc?.[part], payload)

    if (value === undefined) {
      allReplacementsSuccessful = false
      return ''
    }

    return String(value)
  })

  return allReplacementsSuccessful ? interpolatedRoute : null
}

export default Form
