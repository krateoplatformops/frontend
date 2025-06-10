import { Button, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { JSONSchema4 } from 'json-schema'
import _ from 'lodash'
import { useEffect, useId, useRef } from 'react'

import { useConfigContext } from '../../context/ConfigContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import { getResourceRef } from '../../utils/utils'
import { useDrawerContext } from '../Drawer/DrawerContext'

import type { Form as WidgetType } from './Form.type'
import FormGenerator from './FormGenerator'

export type FormWidgetData = WidgetType['spec']['widgetData']

function Form({ actions, resourcesRefs, widgetData }: WidgetProps<FormWidgetData>) {
  const drawerContext = useDrawerContext()
  const alreadySetDrawerData = useRef(false)

  const { config } = useConfigContext()

  const submitAction = Object.values(actions)
    .flat()
    .find(({ id }) => id === widgetData.submitActionId)

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
              Save
            </Button>
          </Space>
        ),
        title: 'Widget title',
      })
      alreadySetDrawerData.current = true
    }
  }, [drawerContext, drawerContext.insideDrawer, formId])

  /* if the form is inside a Drawer, button will be already rendered in the Drawer  */
  const shouldRenderButtonsInsideForm = !drawerContext.insideDrawer

  return (
    <div>
      {shouldRenderButtonsInsideForm ? (
        <Space>
          <Button form={formId} htmlType='reset' type='default'>
            Reset
          </Button>
          <Button form={formId} htmlType='submit' type='primary'>
            Save
          </Button>
        </Space>
      ) : null}

      <FormGenerator
        descriptionTooltip={true}
        formId={formId}
        onSubmit={async (values) => {
          console.log(values)
          console.log({ submitAction })

          // convert all dayjs date to ISOstring
          Object.keys(values).forEach((k) => {
            if (dayjs.isDayjs(values[k])) {
              values[k] = (values[k] as unknown as Dayjs).toISOString()
            }
          })

          if (!submitAction) {
            throw new Error('Submit action not found')
          }

          if (submitAction.type !== 'rest') {
            throw new Error('Submit action type is not "rest"')
          }
          // const formEndpoint = template.template.path
          // const formVerb = template.template.verb
          // const formOverride = template.template.payloadToOverride
          // const formKey = template.template.payloadFormKey || data.status.props.payloadFormKey || 'spec'

          const resourceRef = getResourceRef(submitAction.resourceRefId, resourcesRefs)
          const url = config?.api.BACKEND_API_BASE_URL + resourceRef.path

          const method = resourceRef.verb

          const formKey = 'spec'
          let payload = { ...resourceRef.payload, ...values }
          debugger

          if (submitAction.payloadToOverride && submitAction.payloadToOverride.length > 0) {
            const updateJson = (values: object, keyPath: string, valuePath: string) => {
              debugger
              const getObjectByPath = (obj: object, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj)

              const substr = valuePath.replace('${', '').replace('}', '')
              const parts = substr.split('+').map((el) => el.trim())

              const value = parts
                .map((el) => (el.startsWith('"') || el.startsWith("'") ? el.replace(/"/g, '') : getObjectByPath(values, el) || ''))
                .join('')

              return _.merge({}, values, convertStringToObject(keyPath, value))
            }

            submitAction.payloadToOverride.forEach((el) => {
              payload = updateJson(payload, el.name, el.value)
            })
          }
          debugger

          /* get all the keys that are not in the resourceRef.payload, basically the form values */
          const valuesKeys = Object.keys(payload).filter((el) => Object.keys(resourceRef.payload).indexOf(el) === -1)
          payload[formKey] = {}
          valuesKeys.forEach((el) => {
            payload[formKey][el] = typeof payload[el] === 'object' && !Array.isArray(payload[el]) ? { ...payload[el] } : payload[el]
            delete payload[el]
          })
          debugger

          const res = await fetch(url, {
            body: JSON.stringify(payload),
            headers: {
              // 'X-Krateo-Groups': 'admins',
              // 'X-Krateo-User': 'admin',
              Authorization: `Bearer ${getAccessToken()}`,
            },
            method,
          })

          // TODO: write this type
          const json = await res.json()

          // send all data values to specific endpoint as POST
          // if (formEndpoint && formVerb) {
          //   // update payload by payloadToOverride
          //   if (formOverride?.length > 0) {
          //     formOverride.forEach((el) => {
          //       payload = updateJson(payload, el.name, el.value)
          //     })
          //   }

          //   const valuesKeys = Object.keys(payload).filter((el) => Object.keys(template.template.payload).indexOf(el) === -1)
          //   // move all values data under formKey
          //   payload[formKey] = {}
          //   valuesKeys.forEach((el) => {
          //     payload[formKey][el] = typeof payload[el] === 'object' && !Array.isArray(payload[el]) ? { ...payload[el] } : payload[el]
          //     delete payload[el]
          //   })
          //   const endpointUrl = updateNameNamespace(formEndpoint, payload.metadata.name, payload.metadata.namespace)
          //   // Sets correct redirect route value to be used on success
          //   if (formProps?.redirectRoute) {
          //     handleRedirectRoute(payload, formProps?.redirectRoute)
          //   }
          //   // submit payload
          //   switch (formVerb.toLowerCase()) {
          //     case 'put':
          //       if (!isPutLoading && !isPutError && !isPutSuccess) {
          //         await putContent({
          //           body: payload,
          //           endpoint: endpointUrl,
          //         })
          //         // if into a panel -> close panel
          //         if (onClose && !formProps?.redirectRoute) {
          //           onClose()
          //         }
          //         if (!onClose) {
          //           // clear form
          //           simpleForm.resetFields()
          //         }
          //       }
          //       break
          //     case 'post':
          //     default:
          //       if (!isPostLoading && !isPostError && !isPostSuccess) {
          //         await postContent({
          //           body: payload,
          //           endpoint: endpointUrl,
          //         })
          //         // if into a panel -> close panel
          //         if (onClose && !formProps?.redirectRoute) {
          //           onClose()
          //         }
          //         if (!onClose) {
          //           // clear form
          //           simpleForm.resetFields()
          //         }
          //       }
          //       break
          //   }
          // }
        }}
        schema={widgetData.schema as JSONSchema4}
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

export default Form
