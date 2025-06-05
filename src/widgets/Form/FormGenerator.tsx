import { Anchor, Button, Col, Form, Input, InputNumber, Radio, Row, Select, Slider, Space, Switch, Typography } from 'antd'
import _ from 'lodash'
import { useCallback, useEffect } from 'react'
import ListEditor from '../../components/ListEditor'

import { JSONSchema4 } from 'json-schema'
import styles from './Form.module.css'

type FormGeneratorType = {
  descriptionTooltip: boolean
  showFormStructure?: boolean
  schema: JSONSchema4
  formId: string
  // onClose?: () => void,
  // disableButtons?: (value: boolean) => void
}

const FormGenerator = ({ formId, descriptionTooltip = false, showFormStructure = false, schema }: FormGeneratorType) => {
  const [form] = Form.useForm()
  const requiredFields = schema.required as string[]

  // Check on CompositionCreated event for redirect
  // useEffect(() => {
  // 	const eventsEndpoint = `${getBaseUrl("EVENTS_PUSH")}/notifications`;
  // 	const eventSource = new EventSource(eventsEndpoint, {
  // 			withCredentials: false,
  // 	});

  // 	eventSource.addEventListener('krateo', (event) => {
  // 		const data = JSON.parse(event.data);
  // 		if (data?.reason === 'CompositionCreated') {
  // 			setEventReceived(true)
  // 		}
  // 	});

  // 	return () => eventSource.close();
  // }, []);

  const parseData = (node: JSONSchema4, name: string = '') => {
    const currentProperties = node.properties
    if (currentProperties) {
      return Object.keys(currentProperties).map((key) => {
        const currentName = name ? `${name}.${key}` : key
        if (currentProperties[key].type === 'object') {
          return parseData(currentProperties[key], currentName)
        } else {
          const required = (Array.isArray(node?.required) && node.required.indexOf(key) > -1) || requiredFields.indexOf(key) > -1
          const label = currentProperties[key].title || key
          return renderField(label, currentName, currentProperties[key], required)
        }
      })
    } else {
      return []
    }
  }

  const renderFields = () => {
    return parseData(schema)
  }

  useEffect(() => {
    setInitialValues()
  }, [schema])

  const setInitialValues = () => {
    const parseData = (node: JSONSchema4, name: string = '') => {
      const currentProperties = node.properties
      if (currentProperties) {
        return Object.keys(currentProperties).map((key) => {
          const currentName = name ? `${name}.${key}` : key
          if (currentProperties[key].type === 'object') {
            return parseData(currentProperties[key], currentName)
          } else {
            // set default value
            if (currentProperties[key].default) {
              form.setFieldValue(currentName.split('.'), currentProperties[key].default)
            }
          }
        })
      } else {
        return []
      }
    }

    parseData(schema)
  }

  const renderLabel = (path: string, label: string) => {
    const breadcrumb = path.split('.')
    breadcrumb.splice(-1)

    return (
      <Space size='small' direction='vertical' className={styles.labelField}>
        <Typography.Text strong>{label}</Typography.Text>
        <Space title={breadcrumb.join(' > ')} className={styles.breadcrumb}>
          {breadcrumb.map((el, index) => {
            if (index < breadcrumb.length - 1) {
              if (index === 2 && breadcrumb.length > 3) {
                return (
                  <Typography.Text key={`label_breadcrumb_${index}`} className={styles.breadcrumbDots}>
                    ... <span> &rsaquo; </span>
                  </Typography.Text>
                )
              } else if (index > 2 && index < breadcrumb.length - 1 && breadcrumb.length > 3) {
                return ''
              } else {
                return (
                  <Typography.Text key={`label_breadcrumb_${index}`} ellipsis>
                    {el} <span> &rsaquo; </span>
                  </Typography.Text>
                )
              }
            } else {
              return (
                <Typography.Text key={`label_breadcrumb_${index}`} ellipsis>
                  {el}
                </Typography.Text>
              )
            }
          })}
        </Space>
      </Space>
    )
  }

  const renderField = (label: string, name: string, node: any, required: boolean) => {
    const rules: any[] = []
    if (required) {
      rules.push({ required: true, message: 'Insert a value' })
    }
    if (node.pattern) {
      rules.push({ pattern: node.pattern, message: 'Insert right value' })
    }

    switch (node.type) {
      case 'string':
        return (
          <div id={name} className={styles.formField}>
            <Form.Item
              key={name}
              label={renderLabel(name, label)}
              name={name.split('.')}
              rules={rules}
              tooltip={descriptionTooltip && node.description ? node.description : undefined}
              extra={!descriptionTooltip && node.description ? node.description : undefined}
            >
              {node.enum ? (
                node.enum.length > 4 ? (
                  <Select options={node.enum.map((opt) => ({ value: opt, label: opt }))} allowClear />
                ) : (
                  <Radio.Group>
                    {node.enum.map((el) => (
                      <Radio key={`radio_${el}`} value={el}>
                        {el}
                      </Radio>
                    ))}
                  </Radio.Group>
                )
              ) : (
                <Input />
              )}
            </Form.Item>
          </div>
        )

      case 'boolean':
        form.setFieldValue(name.split('.'), false)
        return (
          <div id={name} className={styles.formField}>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Form.Item
                key={name}
                label={renderLabel(name, label)}
                name={name.split('.')}
                valuePropName='checked'
                rules={rules}
                tooltip={descriptionTooltip && node.description ? node.description : undefined}
                extra={!descriptionTooltip && node.description ? node.description : undefined}
              >
                <Switch />
              </Form.Item>
            </Space>
          </div>
        )

      case 'array':
        return (
          <div id={name} className={styles.formField}>
            <Form.Item
              key={name}
              label={renderLabel(name, label)}
              name={name.split('.')}
              rules={rules}
              tooltip={descriptionTooltip && node.description ? node.description : undefined}
              extra={!descriptionTooltip && node.description ? node.description : undefined}
            >
              <ListEditor
                onChange={(values) => {
                  form.setFieldValue(name.split('.'), values)
                }}
              />
            </Form.Item>
          </div>
        )

      case 'integer':
        form.setFieldValue(name.split('.'), node.minimum || 0)
        const min = node.minimum
        const max = node.maximum
        return (
          <div id={name} className={styles.formField}>
            <Form.Item
              key={name}
              label={renderLabel(name, label)}
              name={name.split('.')}
              rules={rules}
              tooltip={descriptionTooltip && node.description ? node.description : undefined}
              extra={!descriptionTooltip && node.description ? node.description : undefined}
            >
              {min && max && max - min < 100 ? (
                <Slider step={1} min={min} max={max} />
              ) : (
                <InputNumber min={min ? min : 0} max={max ? max : undefined} step={1} style={{ width: '100%' }} />
              )}
            </Form.Item>
          </div>
        )
    }
  }

  const getAnchorList = () => {
    const parseData = (node: JSONSchema4, name: string = '') => {
      const currentProperties = node.properties
      if (currentProperties) {
        return Object.keys(currentProperties).map((key) => {
          const currentName = name ? `${name}.${key}` : key
          const label = currentProperties[key].title || key

          if (currentProperties[key].type === 'object') {
            // create children
            return {
              key: currentName,
              title: (
                <span key={key} className={styles.anchorObjectLabel}>
                  {label}
                </span>
              ),
              children: parseData(currentProperties[key], currentName),
            }
          } else {
            // return obj
            return {
              key: currentName,
              href: `#${currentName}`,
              title: label,
            }
          }
        })
      } else {
        return []
      }
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

  const handleRedirectRoute = (payload: any, route: string) => {
    const interpolatedRoute = interpolateRoute(payload, route)

    if (!interpolatedRoute) {
      // catchError({
      // 	code: 400,
      // 	data: {
      // 		message: "Impossible to redirect, the route contains an undefined value"
      // 	}
      // });
    } else {
      setSubmitRedirectRoute(interpolatedRoute)
    }
  }

  const onSubmit = async (values: object) => {
    debugger
    // // convert all dayjs date to ISOstring
    // Object.keys(values).forEach(k => {
    // 	if (dayjs.isDayjs(values[k])) {
    // 		values[k] = (values[k] as unknown as Dayjs).toISOString()
    // 	}
    // });
    // 			const formProps = data.status.props
    // 			const template = data.status.actions.find(el => ((el.template?.id?.toLowerCase() === formProps?.onSubmitId?.toLowerCase()) && (el.template?.verb.toLowerCase() === formProps?.onSubmitVerb.toLowerCase())))
    // 			if (template?.template) {
    // 				const formEndpoint = template.template.path;
    // 				const formVerb = template.template.verb;
    // 				const formOverride = template.template.payloadToOverride;
    // 				const formKey = template.template.payloadFormKey || data.status.props.payloadFormKey || "spec";
    // 				let payload = {...template.template.payload, ...values};
    // 				// send all data values to specific endpoint as POST
    // 				if (formEndpoint && formVerb) {
    // 					// update payload by payloadToOverride
    // 					if (formOverride?.length > 0) {
    // 						formOverride.forEach(el => {
    // 							payload = updateJson(payload, el.name, el.value)
    // 						});
    // 					}
    // 					const valuesKeys = Object.keys(payload).filter(el => Object.keys(template.template.payload).indexOf(el) === -1);
    // 					// move all values data under formKey
    // 					payload[formKey] = {}
    // 					valuesKeys.forEach(el => {
    // 						payload[formKey][el] = (typeof payload[el] === 'object' && !Array.isArray(payload[el])) ? {...payload[el]} : payload[el]
    // 						delete payload[el]
    // 					})
    // 					const endpointUrl = updateNameNamespace(formEndpoint, payload.metadata.name, payload.metadata.namespace)
    // 					// Sets correct redirect route value to be used on success
    // 					if (formProps?.redirectRoute) {
    // 						handleRedirectRoute(payload, formProps?.redirectRoute)
    // 					}
    // 					// submit payload
    // 					switch (formVerb.toLowerCase()) {
    // 						case "put":
    // 							if (!isPutLoading && !isPutError && !isPutSuccess) {
    // 								await putContent({
    // 									endpoint: endpointUrl,
    // 									body: payload,
    // 								});
    // 								// if into a panel -> close panel
    // 								if (onClose && !formProps?.redirectRoute) {
    // 									onClose()
    // 								}
    // 								if (!onClose) {
    // 									// clear form
    // 									simpleForm.resetFields()
    // 								}
    // 							}
    // 						break;
    // 						case "post":
    // 						default:
    // 							if (!isPostLoading && !isPostError && !isPostSuccess) {
    // 								await postContent({
    // 									endpoint: endpointUrl,
    // 									body: payload,
    // 								});
    // 								// if into a panel -> close panel
    // 								if (onClose && !formProps?.redirectRoute) {
    // 									onClose()
    // 								}
    // 								if (!onClose) {
    // 									// clear form
    // 									simpleForm.resetFields()
    // 								}
    // 							}
    // 						break;
    // 					}
    // 				}
    // 			}
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

  const fields = renderFields()

  // Handles redirect
  // useEffect(() => {
  // 	if (shouldRedirect) {
  // 		if (disableButtons) disableButtons(true)
  // 		message.destroy();

  // 		const timeout = data.status.props?.redirectTimeout || 5;
  // 		const hideMessage = message.loading('Creating the new resource and redirecting...', timeout);

  // 		const checkCondition = () => {
  // 			if (eventReceivedRef.current) {
  // 				if (onClose) onClose();
  // 				if (disableButtons) disableButtons(false)

  // 				message.destroy();

  // 				navigate(submitRedirectRoute)
  // 			} else {
  // 				requestAnimationFrame(checkCondition);
  // 			}
  // 		};

  // 		requestAnimationFrame(checkCondition);

  // 		hideMessage.then(() => {
  // 			if (onClose) onClose();
  // 			if (disableButtons) disableButtons(false)

  // 			if (!eventReceivedRef.current) {
  // 				message.info('The resource is not ready for redirect, access it manually.');
  // 			}

  // 			setShouldRedirect(false);
  // 			setEventReceived(false);
  // 		});
  // 	}
  // }, [message, shouldRedirect, submitRedirectRoute, onClose, navigate]);

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
                id={formId}
                form={form}
                layout='vertical'
                onFinish={onSubmit}
                onReset={(e) => {
                  debugger
                  e.preventDefault()
                  setInitialValues()
                }}
                onFinishFailed={onFinishFailed}
                name='formGenerator'
                autoComplete='off'
              >
                {fields}
              </Form>
            </div>
          </Col>

          {showFormStructure && (
            <Col span={12} className={styles.anchorLabelWrapper}>
              <Anchor
                affix={false}
                onClick={handleAnchorClick}
                getContainer={() => document.getElementById('anchor-content') as HTMLDivElement}
                items={getAnchorList()}
              />
            </Col>
          )}
        </Row>
      </div>
    </div>
  )
}

export default FormGenerator
