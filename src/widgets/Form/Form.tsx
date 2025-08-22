import { LoadingOutlined } from '@ant-design/icons'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Result, Space, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import dayjs from 'dayjs'
import type { JSONSchema4 } from 'json-schema'
import { useEffect, useId, useRef } from 'react'

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
  buttonConfig?: FormWidgetData['buttonConfig']
  disabled?: boolean | undefined
  form?: string | undefined
  loading?: boolean
}

const FormExtra = ({ buttonConfig, disabled = false, form, loading }: FormExtraProps): React.ReactNode => {
  return (
    <Space>
      <Button
        disabled={disabled}
        form={form}
        htmlType='reset'
        icon={buttonConfig?.secondary?.icon ? <FontAwesomeIcon icon={buttonConfig?.secondary?.icon as IconProp} /> : undefined}
        type='default'
      >
        {buttonConfig?.secondary?.label || 'Reset'}
      </Button>
      <Button
        form={form}
        htmlType='submit'
        icon={buttonConfig?.primary?.icon ? <FontAwesomeIcon icon={buttonConfig?.primary?.icon as IconProp} /> : undefined}
        loading={loading}
        type='primary'
      >
        {buttonConfig?.primary?.label || 'Submit'}
      </Button>
    </Space>
  )
}

const Form = ({ resourcesRefs, widgetData }: WidgetProps<FormWidgetData>) => {
  const { actions, autocomplete, buttonConfig, dependencies, fieldDescription, objectFields, schema, stringSchema, submitActionId } = widgetData
  const { insideDrawer, setDrawerData } = useDrawerContext()
  const alreadySetDrawerData = useRef(false)

  const { notification } = useApp()
  const { handleAction, isActionLoading } = useHandleAction()

  /* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form */
  const formId = useId()

  useEffect(() => {
    if (insideDrawer && !alreadySetDrawerData.current) {
      setDrawerData({ extra: <FormExtra buttonConfig={buttonConfig} form={formId} loading={isActionLoading} /> })
      alreadySetDrawerData.current = true
    }
  }, [buttonConfig, formId, insideDrawer, isActionLoading, setDrawerData])

  const action = Object.values(actions)
    .flat()
    .find(({ id }) => id === submitActionId)

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
    if (!action) {
      notification.error({
        description: `The widget definition does not include an action (ID: ${submitActionId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    // TODO: check if in the future Form should handle other action types
    if (action.type !== 'rest') {
      notification.error({
        description: 'Submit action type is not "rest"',
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    // TODO: understand if this could be removed (it's already inside the useHandleActions)
    const resourceRef = getResourceRef(action.resourceRefId, resourcesRefs)

    if (!resourceRef) {
      notification.error({
        description: `The widget definition does not include a resource reference for resource (ID: ${action.resourceRefId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      setDrawerData({ extra: <FormExtra buttonConfig={buttonConfig} form={formId} loading={isActionLoading} /> })

      return
    }

    const values = convertDayjsToISOString(formValues)
    const payload: Payload = { ...resourceRef.payload, ...values }

    // TODO: handle disabled buttons
    if (action.onEventNavigateTo) {
      /* FIXME: This is a bit dirty, should disable the already present buttons instead */
      setDrawerData({ extra: <FormExtra buttonConfig={buttonConfig} disabled form={formId} loading={isActionLoading} /> })
    }

    await handleAction(action, resourcesRefs, payload)
  }

  if (isActionLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} spinning />
      </div>
    )
  }

  return (
    <div className={styles.form}>
      {shouldRenderButtonsInsideForm ? <FormExtra buttonConfig={buttonConfig} form={formId} loading={isActionLoading} /> : null}

      <FormGenerator
        autocomplete={autocomplete}
        dependencies={dependencies}
        descriptionTooltip={fieldDescription === 'tooltip'}
        formId={formId}
        objectFields={objectFields}
        onSubmit={values => onSubmit(values)}
        schema={formSchema}
        showFormStructure={true}
      />
    </div>
  )
}

export default Form
