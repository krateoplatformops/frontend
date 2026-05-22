import type { FormItemProps } from 'antd'
import { Form } from 'antd'

import styles from './Form.module.css'

type FormFieldWrapperProps = {
  children: React.ReactNode
  formItemProps: FormItemProps
  id: string
  optionalHidden: boolean
  required: boolean
}

const FormFieldWrapper = ({
  children,
  formItemProps,
  id,
  optionalHidden,
  required,
}: FormFieldWrapperProps) => {
  const hidden = optionalHidden && !required

  return (
    <div className={`${styles.formField} ${hidden ? styles.hidden : ''}`} id={id} >
      <Form.Item {...formItemProps} hidden={hidden} >
        {children}
      </Form.Item>
    </div>
  )
}

export default FormFieldWrapper
