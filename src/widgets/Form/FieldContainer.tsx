import { Form, type FormInstance } from 'antd'
import type { FormItemProps, Rule } from 'antd/es/form'

import { useFieldVisibility } from '../../hooks/useFieldVisibility'

import styles from './Form.module.css'
import type { DisplayDependency } from './FormGenerator'

type FieldContainerProps = {
  children: React.ReactNode
  displayingDependency?: DisplayDependency
  description?: string
  descriptionTooltip: boolean
  form: FormInstance
  id: string
  label: React.ReactNode
  name: string[]
  optionalHidden: boolean
  preserve?: boolean
  required: boolean
  initialValue?: FormItemProps['initialValue']
  rules?: Rule[]
  shouldUpdate?: FormItemProps['shouldUpdate']
  valuePropName?: FormItemProps['valuePropName']
}

const FieldContainer = ({
  children,
  description,
  descriptionTooltip,
  displayingDependency,
  form,
  id,
  initialValue,
  label,
  name,
  optionalHidden,
  preserve,
  required,
  rules,
  shouldUpdate,
  valuePropName,
}: FieldContainerProps) => {
  const visible = useFieldVisibility(displayingDependency, form)

  if (!visible) {
    return null
  }

  const hidden = optionalHidden && !required

  return (
    <div className={`${styles.formField} ${hidden ? styles.hidden : ''}`} id={id}>
      <Form.Item
        extra={!descriptionTooltip ? description : undefined}
        hidden={hidden}
        initialValue={initialValue as unknown}
        label={label}
        name={name}
        preserve={preserve}
        rules={rules}
        shouldUpdate={shouldUpdate}
        tooltip={descriptionTooltip ? description : undefined}
        valuePropName={valuePropName}
      >
        {children}
      </Form.Item>
    </div>
  )
}

export default FieldContainer
