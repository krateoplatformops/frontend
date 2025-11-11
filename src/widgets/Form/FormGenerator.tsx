/* eslint-disable @typescript-eslint/no-use-before-define */
import { Anchor, Col, Form, Input, InputNumber, Radio, Row, Select, Slider, Space, Switch, Typography } from 'antd'
import type { AnchorLinkItemProps } from 'antd/es/anchor/Anchor'
import type { Rule } from 'antd/es/form'
import type { DefaultOptionType } from 'antd/es/select'
import type { JSONSchema4 } from 'json-schema'
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ListEditor from '../../components/ListEditor'
import ListObjectFields from '../../components/ListObjectFields'
import type { ResourcesRefs } from '../../types/Widget'

import AsyncSelect from './fields/AsyncSelect'
import AutoComplete from './fields/AutoComplete'
import type { FormWidgetData } from './Form'
import styles from './Form.module.css'

type FormGeneratorType = {
  descriptionTooltip: boolean
  formId: string
  onSubmit: (values: Record<string, unknown>) => Promise<void>
  resourcesRefs: ResourcesRefs
  schema: JSONSchema4
  autocomplete?: FormWidgetData['autocomplete']
  dependencies?: FormWidgetData['dependencies']
  objectFields?: FormWidgetData['objectFields']
  showFormStructure?: boolean
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

const FormGenerator = ({
  autocomplete,
  dependencies,
  descriptionTooltip = false,
  formId,
  objectFields,
  onSubmit,
  resourcesRefs,
  schema,
  showFormStructure = false,
}: FormGeneratorType) => {
  const [form] = Form.useForm()
  const requiredFields: string[] = Array.isArray(schema.required) ? schema.required : []
  const [optionalHidden, setOptionalHidden] = useState<boolean>(false)

  const { optionalCount, totalCount } = getOptionalCount(schema, requiredFields)

  const hasOptionalFields = useMemo(() => optionalCount > 0 && optionalCount < totalCount, [optionalCount, totalCount])

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

  const parseData = ({ properties, required }: JSONSchema4, name: string[] = [], parentIsRequired: boolean = true): Field[] => {
    if (properties) {
      const requiredFields = Array.isArray(required) ? required : []

      return Object.keys(properties).flatMap((key) => {
        const prop = properties[key]
        const currentPath = [...name, key]

        const isRequired = requiredFields.includes(key) && parentIsRequired

        if (prop.type === 'object' && prop.properties) {
          return parseData(prop, currentPath, isRequired)
        }

        return [renderField(prop.title || key, currentPath.join('.'), prop, isRequired)]
      })
    }

    return []
  }

  const renderField = (label: string, name: string, node: JSONSchema4, required: boolean) => {
    if (Array.isArray(node.type)) {
      console.error(`type as array is not supported: ${node.type.join(',')} for field ${name}`)
      return null
    }

    const rules: Rule[] = []

    if (required) {
      rules.push({ message: 'Insert a value', required: true })
    }

    if (node.pattern) {
      rules.push({ message: 'Insert right value', pattern: new RegExp(node.pattern) })
    }

    switch (node.type) {
      case 'string': {
        const formItemContent = (() => {
          // AsyncSelect
          if (dependencies) {
            const data = dependencies.find(field => field.name === name)

            if (data) {
              return <AsyncSelect data={data} form={form} resourcesRefs={resourcesRefs} />
            }
          }

          const options = Array.isArray(node.enum)
            ? node.enum
              .filter((optionValue): optionValue is string | number => typeof optionValue === 'string' || typeof optionValue === 'number')
              .map((optionValue) => ({ label: String(optionValue), value: optionValue } as DefaultOptionType))
            : undefined

          // Autocomplete
          if (autocomplete) {
            const data = autocomplete.find(field => field.name === name)

            if (data) {
              return <AutoComplete data={data} form={form} options={options} resourcesRefs={resourcesRefs} />
            }
          }

          // Enum
          if (options) {
            if (options.length > 4) {
              return <Select allowClear options={options} />
            }

            return (
              <Radio.Group>
                {options.map(({ label, value }) => (
                  <Radio key={`radio_${value}`} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            )
          }

          // Default
          return <Input />
        })()

        return (
          <div className={`${styles.formField} ${optionalHidden && !required ? styles.hidden : 'auto'}`} id={name}>
            <Form.Item
              extra={!descriptionTooltip && node.description ? node.description : undefined}
              hidden={optionalHidden && !required}
              key={name}
              label={renderLabel(name, label)}
              name={name.split('.')}
              rules={rules}
              tooltip={descriptionTooltip && node.description ? node.description : undefined}
            >
              {formItemContent}
            </Form.Item>
          </div>
        )
      }

      case 'boolean':
        if (form.getFieldValue(name.split('.')) === undefined) {
          form.setFieldValue(name.split('.'), false)
        }
        return (
          <div className={`${styles.formField} ${optionalHidden && !required ? styles.hidden : 'auto'}`} id={name}>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Form.Item
                extra={!descriptionTooltip && node.description ? node.description : undefined}
                hidden={optionalHidden && !required}
                key={name}
                label={renderLabel(name, label)}
                name={name.split('.')}
                preserve={true}
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
        if (objectFields && node.items) {
          const objFields = objectFields.find(({ path }) => path === name)
          if (objFields) {
            // objects
            return (
              <div className={`${styles.formField} ${optionalHidden && !required ? styles.hidden : 'auto'}`} id={name}>
                <Form.Item
                  extra={!descriptionTooltip && node.description ? node.description : undefined}
                  hidden={optionalHidden && !required}
                  key={name}
                  label={renderLabel(name, label)}
                  name={name.split('.')}
                  rules={rules}
                  tooltip={descriptionTooltip && node.description ? node.description : undefined}
                >
                  <ListObjectFields
                    container={document.body}
                    data={form.getFieldValue(name.split('.')) as unknown[] || []}
                    displayField={objFields.displayField}
                    fields={parseData(node.items)}
                    onSubmit={(values) => {
                      form.setFieldValue(name.split('.'), values)
                    }}
                    schema={node.items}
                  />
                </Form.Item>
              </div>
            )
          }
        }
        // strings
        return (
          <div className={`${styles.formField} ${optionalHidden && !required ? styles.hidden : 'auto'}`} id={name}>
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
                data={form.getFieldValue(name.split('.')) as string[] || []}
                onChange={(values) => {
                  form.setFieldValue(name.split('.'), values)
                }}
              />
            </Form.Item>
          </div>
        )

      case 'integer': {
        if (node.minimum) { form.setFieldValue(name.split('.'), node.minimum) }
        const min = node.minimum
        const max = node.maximum

        return (
          <div className={`${styles.formField} ${optionalHidden && !required ? styles.hidden : 'auto'}`} id={name}>
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
                <Slider className={styles.slider} max={max} min={min} step={1} />
              ) : (
                <InputNumber max={max ? max : undefined} min={min ? min : 0} step={1} style={{ width: '100%' }} />
              )}
            </Form.Item>
          </div>
        )
      }
    }
  }

  const getAnchorList = (): AnchorLinkItemProps[] => {
    const parseData = (node: JSONSchema4, name = ''): AnchorLinkItemProps[] => {
      const currentProperties = node.properties
      const requiredFields = node.required ?? []

      if (!currentProperties) { return [] }

      return Object.keys(currentProperties).flatMap((key) => {
        const schemaItem = currentProperties[key]
        const currentName = name ? `${name}.${key}` : key
        const isRequired = Array.isArray(requiredFields) && requiredFields.includes(key)

        const children = schemaItem.type === 'object'
          ? parseData(schemaItem, currentName)
          : []

        const shouldShow = isRequired || children.length > 0 || !optionalHidden
        if (!shouldShow) { return [] }

        const nodeItem: AnchorLinkItemProps = {
          href: schemaItem.type === 'object' ? '#' : `#${currentName}`,
          key: currentName,
          title:
            schemaItem.type === 'object' ? (
              <span className={styles.anchorObjectLabel}>{key}</span>
            ) : (
              key
            ),
          ...(children.length > 0 ? { children } : {}),
        }

        return [nodeItem]
      })
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
    const linkElement = event.currentTarget as HTMLAnchorElement
    const [_, href] = linkElement.href.split('#') /* only take the part after the # */
    const element = document.getElementById(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      console.warn(`Anchor link ${href} not found`)
    }
  }

  return (
    <div className={styles.formGenerator}>
      <div className={styles.anchorWrapper}>
        <Row className={styles.anchorRow}>
          <Col className={styles.formWrapper} span={showFormStructure ? 16 : 24}>
            <div className={styles.form} id='anchor-content'>
              {
                hasOptionalFields && (
                  <div className={styles.optionalFieldsSwitchWrapper}>
                    <Space className={styles.optionalFieldsSwitch} direction='horizontal' size='small'>
                      <Switch onChange={(value) => setOptionalHidden(value) } value={optionalHidden} />
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
                onFinish={(values: Record<string, unknown>) => {
                  onSubmit(values).catch((error) => {
                    console.error(`Error while executing the Form onFinish function: ${error}`)
                  })
                }}
                onFinishFailed={onFinishFailed}
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
            <Col className={styles.anchorLabelWrapper} span={8}>
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
