import { Button, Result, Space } from 'antd'
import useApp from 'antd/es/app/useApp'
import dayjs from 'dayjs'
import type { JSONSchema4 } from 'json-schema'
import { useEffect, useId, useRef } from 'react'

import { useConfigContext } from '../../context/ConfigContext'
import { useHandleAction } from '../../hooks/useHandleActions'
import type { WidgetProps } from '../../types/Widget'
import type { Payload } from '../../utils/types'
import { getResourceRef } from '../../utils/utils'
import { useDrawerContext } from '../Drawer/DrawerContext'

import styles from './Form.module.css'
import type { Form as WidgetType } from './Form.type'
import FormGenerator from './FormGenerator'

export type FormWidgetData = WidgetType['spec']['widgetData']

/**
 * Returns a new object where all Dayjs instances in a flat input object
 * are converted into ISO 8601 string format using `.toISOString()`.
 *
 * This function does not mutate the original object. It returns a shallow copy
 * of the input where any Dayjs values are stringified.
 *
 * @param values - A flat object with values that may include Dayjs instances
 * @returns A new object with Dayjs instances converted to ISO strings
 */
const convertDayjsToISOString = (values: object): object => {
  const result: Record<string, unknown> = {}

  Object.entries(values as Record<string, unknown>).forEach(([key, value]) => {
    if (dayjs.isDayjs(value)) {
      result[key] = value.toISOString()
    } else {
      result[key] = value
    }
  })

  return result
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
  const { actions, autocomplete, fieldDescription, schema, stringSchema, submitActionId } = widgetData
  const { insideDrawer, setDrawerData } = useDrawerContext()
  const alreadySetDrawerData = useRef(false)

  const { config } = useConfigContext()
  const { notification } = useApp()
  const { handleAction } = useHandleAction()

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
          subTitle={`The widget definition does not include an action (ID: ${submitActionId})`}
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

  const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

  const formSchema = (stringSchema ? JSON.parse(stringSchema) : schema) as JSONSchema4

  // If the form is inside a Drawer, button will be already rendered in the Drawer
  const shouldRenderButtonsInsideForm = !insideDrawer

  const onSubmit = async (formValues: object) => {
    // TODO: check if in the future Form should handle other action types
    if (action.type !== 'rest') {
      notification.error({
        description: 'Submit action type is not "rest"',
        message: 'Error submitting form',
        placement: 'bottomLeft',
      })

      return
    }

    if (!resourceRef) {
      setDrawerData({ extra: <FormExtra form={formId} /> })
    } else {
      const { path, payload: resourcePayload, verb } = resourceRef

      const url = config?.api.SNOWPLOW_API_BASE_URL + path
      const values = convertDayjsToISOString(formValues)
      const payload: Payload = { ...resourcePayload, ...values }

      // TODO: handle disabled buttons
      if (action.onEventNavigateTo) {
        /* FIXME: This is a bit dirty, should disable the already present buttons instead */
        setDrawerData({ extra: <FormExtra disabled form={formId} /> })
      }

      await handleAction(action, url, verb, payload, resourcePayload)
    }
  }

  return (
    <div className={styles.form}>
      {shouldRenderButtonsInsideForm ? <FormExtra form={formId} /> : null}

      <FormGenerator
        autocomplete={autocomplete}
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
