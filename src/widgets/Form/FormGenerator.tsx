import { Anchor, Col, Form, Input, InputNumber, Radio, Row, Select, Slider, Space, Switch, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import type { JSONSchema4 } from 'json-schema'
import _ from 'lodash'
import type { ReactNode } from 'react'
import { useCallback } from 'react'

import ListEditor from '../../components/ListEditor'

import styles from './Form.module.css'

type FormGeneratorType = {
  descriptionTooltip: boolean
  showFormStructure?: boolean
  schema: JSONSchema4
  formId: string
  onSubmit: (values: object) => Promise<void>
}

const FormGenerator = ({ descriptionTooltip = false, formId, onSubmit, schema, showFormStructure = false }: FormGeneratorType) => {
  const [form] = Form.useForm()
  const requiredFields = schema.required as string[]

type Field = ReturnType<typeof renderField>;

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

const setInitialValues = () => {
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
}

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

const getAnchorList = () => {
  const parseData = (node: JSONSchema4, name: string = '') => {
    const currentProperties = node.properties
    if (currentProperties) {
      return Object.keys(currentProperties).map((key) => {
        const currentName = name ? `${name}.${key}` : key
        const label = key

        if (currentProperties[key].type === 'object') {
          // create children
          return {
            children: parseData(currentProperties[key], currentName),
            key: currentName,
            title: (
              <span className={styles.anchorObjectLabel} key={key}>
                {label}
              </span>
            ),
          }
        }
        // return obj
        return {
          href: `#${currentName}`,
          key: currentName,
          title: label,
        }
      })
    }
    return []
  }

  return [...parseData(schema)]
}

const convertStringToObject = (dottedString: string, value: unknown) => {
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

// Example input: valuePath = "${ git.toRepo.name + \"-\" + git.toRepo.org }"
// Example parts: ["git.toRepo.name", "\"-\"", "git.toRepo.org"]
// Example transformation:
// getObjectByPath(values, "git.toRepo.name") → "name"
// getObjectByPath(values, "git.toRepo.org") → "org"
// Result: value = "name-org"

const updateJson = (values: any, keyPath: string, valuePath: string) => {
  const getObjectByPath = (obj: any, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj)

  const substr = valuePath.replace('${', '').replace('}', '')
  const parts = substr.split('+').map((el) => el.trim())

  const value = parts
    .map((el) => (el.startsWith('"') || el.startsWith("'") ? el.replace(/"/g, '') : getObjectByPath(values, el) || ''))
    .join('')

  return _.merge({}, values, convertStringToObject(keyPath, value))
}

const updateNameNamespace = (path: string, name: string, namespace: string) => {
  // add name and namespace on endpoint querystring from payload.metadata
  const qsParameters = path
    .split('?')[1]
    .split('&')
    .filter((el) => el.indexOf('name=') === -1 && el.indexOf('namespace=') === -1)
    .join('&')
  return `${path.split('?')[0]}?${qsParameters}&name=${name}&namespace=${namespace}`
}

const interpolateRoute = (payload: any, route: string): string | null => {
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

const onFinishFailed = useCallback(({ errorFields }: any) => {
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

const handleAnchorClick = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault()
}

return (
  <div className={styles.formGenerator}>
    <div className={styles.anchorWrapper}>
      <Row className={styles.anchorRow}>
        <Col className={styles.formWrapper} span={showFormStructure ? 12 : 24}>
          <div className={styles.form} id='anchor-content'>
            <Form
              autoComplete='off'
              form={form}
              id={formId}
              layout='vertical'
              name='formGenerator'
              onFinish={(values: object) => onSubmit(values)}
              onFinishFailed={onFinishFailed}
              onReset={(e) => {
                e.preventDefault()
                setInitialValues()
              }}
            >
              {parseData(schema)}
              {setInitialValues()}
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
