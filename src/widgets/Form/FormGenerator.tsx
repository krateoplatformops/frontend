import { Anchor, Col, Form, Input, InputNumber, Radio, Row, Select, Slider, Space, Switch, Typography } from 'antd'
import type { AnchorLinkItemProps } from 'antd/es/anchor/Anchor'
import type { Rule } from 'antd/es/form'
import type { JSONSchema4 } from 'json-schema'
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

import ListEditor from '../../components/ListEditor'

import styles from './Form.module.css'

type FormGeneratorType = {
  descriptionTooltip: boolean
  showFormStructure?: boolean
  schema: JSONSchema4
  formId: string
  onSubmit: (values: object) => Promise<void>
}

const getOptionalCount = (node: JSONSchema4, requiredFields: string[]) => {
  const currentProperties = node.properties
  let totalCount = 0
  let optionalCount = 0

  if (currentProperties && typeof currentProperties === 'object') {
    for (const key of Object.keys(currentProperties)) {
      const prop = currentProperties[key]

      if (prop.type === 'object') {
        const counts = getOptionalCount(prop, requiredFields)
        totalCount += counts.totalCount
        optionalCount += counts.optionalCount
      } else {
        const required = (Array.isArray(node?.required) && node.required.indexOf(key) > -1) || requiredFields.indexOf(key) > -1
        totalCount += 1
        optionalCount = required ? optionalCount : optionalCount + 1
      }
    }
  }
  return { optionalCount, totalCount }
}

const FormGenerator = ({ descriptionTooltip = false, formId, onSubmit, schema, showFormStructure = false }: FormGeneratorType) => {
  const [form] = Form.useForm()
  const requiredFields = schema.required as string[]
  const [optionalHidden, setOptionalHidden] = useState<boolean>(false)

type Field = ReturnType<typeof renderField>

const setInitialValues = useCallback(() => {
  const parseData = ({ properties }: JSONSchema4, name: string = ''): void => {
    if (properties) {
      Object.keys(properties).forEach((key) => {
        const currentName = name ? `${name}.${key}` : key
        const property = properties[key]

        if (property.type === 'object') {
          parseData(property, currentName)
          return
        }

        if (property.default !== undefined) {
          let defaultValue = property.default

          if (property.type === 'boolean' && typeof defaultValue !== 'boolean') {
            console.error(
              `boolean field ${currentName} has a default value that is not a boolean: defaulting to false. received value=${JSON.stringify(defaultValue)} type=${typeof JSON.stringify(defaultValue)}`
            )
            defaultValue = false
          }

          if ((property.type === 'integer' || property.type === 'number') && typeof defaultValue !== 'number') {
            console.error(
              `number field ${currentName} has a default value that is not a number. received value=${JSON.stringify(defaultValue)} type=${typeof defaultValue}`
            )
          }

          form.setFieldValue(currentName.split('.'), defaultValue)
        }
      })
    }
  }

  parseData(schema)
}, [form, schema])

useEffect(() => {
  setInitialValues()
}, [setInitialValues])

const renderLabel = (path: string, label: string) => {
  const breadcrumb = path.split('.')
  breadcrumb.splice(-1)

  return (
    <Space className={styles.labelField} direction='vertical' size='small'>
      <Typography.Text strong>{label}</Typography.Text>
      <Space className={styles.breadcrumb} title={breadcrumb.join(' > ')}>
        {breadcrumb.map((el, index) => {
          if (index < breadcrumb.length - 1) {
            if (index === 2 && breadcrumb.length > 3) {
              return (
                <Typography.Text className={styles.breadcrumbDots} key={`label_breadcrumb_${index}`}>
                  ... <span> &rsaquo; </span>
                </Typography.Text>
              )
            } else if (index > 2 && index < breadcrumb.length - 1 && breadcrumb.length > 3) {
              return ''
            }
            return (
              <Typography.Text ellipsis key={`label_breadcrumb_${index}`}>
                {el} <span> &rsaquo; </span>
              </Typography.Text>
            )
          }
          return (
            <Typography.Text ellipsis key={`label_breadcrumb_${index}`}>
              {el}
            </Typography.Text>
          )
        })}
      </Space>
    </Space>
  )
}

const renderField = (label: string, name: string, node: JSONSchema4, required: boolean) => {
  const rules: Rule[] = []
  if (required) {
    rules.push({ message: 'Insert a value', required: true })
  }
  if (node.pattern) {
    rules.push({ message: 'Insert right value', pattern: new RegExp(node.pattern) })
  }

  if (Array.isArray(node.type)) {
    console.error(`type as array is not supported: ${node.type.join(',')} for field ${name}`)
    return null
  }

  switch (node.type) {
    case 'string': {
      let inputComponent: ReactNode

      if (node.enum) {
        if (node.enum.length > 4) {
          inputComponent = <Select allowClear options={node.enum.map((opt) => ({ label: opt, value: opt }))} />
        } else {
          inputComponent = (
            <Radio.Group>
              {node.enum.map((el, index) => (
                <Radio key={`radio_${JSON.stringify(el)}_${index}`} value={el}>
                  {typeof el === 'object' ? JSON.stringify(el) : el}
                </Radio>
              ))}
            </Radio.Group>
          )
        }
      } else {
        inputComponent = <Input />
      }

      return (
        <div className={styles.formField} id={name}>
          <Form.Item
            extra={!descriptionTooltip && node.description ? node.description : undefined}
            hidden={optionalHidden && !required}
            key={name}
            label={renderLabel(name, label)}
            name={name.split('.')}
            rules={rules}
            tooltip={descriptionTooltip && node.description ? node.description : undefined}
          >
            {inputComponent}
          </Form.Item>
        </div>
      )
    }

    case 'boolean':
      form.setFieldValue(name.split('.'), false)
      return (
        <div className={styles.formField} id={name}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Form.Item
              extra={!descriptionTooltip && node.description ? node.description : undefined}
              hidden={optionalHidden && !required}
              key={name}
              label={renderLabel(name, label)}
              name={name.split('.')}
              rules={rules}
              tooltip={descriptionTooltip && node.description ? node.description : undefined}
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Space>
        </div>
      )

    case 'array':
      return (
        <div className={styles.formField} id={name}>
          <Form.Item
            extra={!descriptionTooltip && node.description ? node.description : undefined}
            hidden={optionalHidden && !required}
            key={name}
            label={renderLabel(name, label)}
            name={name.split('.')}
            rules={rules}
            tooltip={descriptionTooltip && node.description ? node.description : undefined}
          >
            <ListEditor
              onChange={(values) => {
                form.setFieldValue(name.split('.'), values)
              }}
            />
          </Form.Item>
        </div>
      )

    case 'integer': {
      form.setFieldValue(name.split('.'), node.minimum || 0)
      const min = node.minimum
      const max = node.maximum

      return (
        <div className={styles.formField} id={name}>
          <Form.Item
            extra={!descriptionTooltip && node.description ? node.description : undefined}
            hidden={optionalHidden && !required}
            key={name}
            label={renderLabel(name, label)}
            name={name.split('.')}
            rules={rules}
            tooltip={descriptionTooltip && node.description ? node.description : undefined}
          >
            {min && max && max - min < 100 ? (
              <Slider max={max} min={min} step={1} />
            ) : (
              <InputNumber max={max ? max : undefined} min={min ? min : 0} step={1} style={{ width: '100%' }} />
            )}
          </Form.Item>
        </div>
      )
    }
  }
}

const parseData = ({ properties, required }: JSONSchema4, name: string = ''): Field[] => {
  if (properties) {
    return Object.keys(properties).flatMap((key) => {
      const currentName = name ? `${name}.${key}` : key
      const prop = properties[key]

      if (prop.type === 'object') {
        return parseData(prop, currentName)
      }

      const isRequired
        = (Array.isArray(required) && required.indexOf(key) > -1)
        || requiredFields.indexOf(key) > -1

      const label = prop.title || key
      return [renderField(label, currentName, prop, isRequired)]
    })
  }
  return []
}

const getAnchorList = (): AnchorLinkItemProps[] => {
  const parseData = (node: JSONSchema4, name = ''): AnchorLinkItemProps[] => {
    const currentProperties = node.properties
    if (currentProperties) {
      return Object.keys(currentProperties).map((key) => {
        const currentName = name ? `${name}.${key}` : key
        const label = key

        if (currentProperties[key].type === 'object') {
          return {
            children: parseData(currentProperties[key], currentName),
            href: '#',
            key: currentName,
            title: (
              <span className={styles.anchorObjectLabel} key={key}>
                {label}
              </span>
            ),
          }
        }

        return {
          href: `#${currentName}`,
          key: currentName,
          title: label,
        }
      })
    }
    return []
  }

  return parseData(schema)
}

const onFinishFailed = useCallback(({ errorFields }: ValidateErrorEntity) => {
  const errorField = errorFields[0].name.join('.')
  const errorFieldElement = document.querySelector(`#${CSS.escape(errorField)}`)

  if (errorFieldElement) {
    errorFieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

    const inputElement = errorFieldElement.querySelector('input, textarea, select') as HTMLElement
    if (inputElement) {
      requestAnimationFrame(() => inputElement.focus())
    }
  }

  const anchorLink = document.querySelector(`a[href='#${CSS.escape(errorField)}']`) as HTMLAnchorElement
  if (anchorLink) {
    anchorLink.click()
    anchorLink.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}, [])

const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
  event.preventDefault()
}

return (
  <div className={styles.formGenerator}>
    <div className={styles.anchorWrapper}>
      <Row className={styles.anchorRow}>
        <Col className={styles.formWrapper} span={showFormStructure ? 12 : 24}>
          <div className={styles.form} id='anchor-content'>
            {
              getOptionalCount(schema, requiredFields).optionalCount > 0 && getOptionalCount(schema, requiredFields).optionalCount < getOptionalCount(schema, requiredFields).totalCount && (
                <div className={styles.optionalFieldsSwitchWrapper}>
                  <Space className={styles.optionalFieldsSwitch} direction='horizontal' size='small'>
                    <Switch onChange={(value) => setOptionalHidden(value)} value={optionalHidden} />
                    <Typography.Text>
                      Hide optional fields
                    </Typography.Text>
                  </Space>
                </div>
              )
            }
            <Form
              autoComplete='off'
              form={form}
              id={formId}
              layout='vertical'
              name='formGenerator'
              onFinish={(values: object) => {
                onSubmit(values).catch((error) => {
                  console.error(`Error while executing the Form onFinish function: ${error}`)
                })
              }} onFinishFailed={onFinishFailed}
              onReset={(event) => {
                event.preventDefault()
                setInitialValues()
              }}
            >
              {parseData(schema)}
            </Form>
          </div>
        </Col>

        {showFormStructure && (
          <Col className={styles.anchorLabelWrapper} span={12}>
            <Anchor
              affix={false}
              getContainer={() => document.getElementById('anchor-content') as HTMLDivElement}
              items={getAnchorList()}
              onClick={handleAnchorClick}
            />
          </Col>
        )}
      </Row>
    </div>
  </div>
)
}

export default FormGenerator
