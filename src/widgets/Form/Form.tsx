import { JSONSchema4 } from 'json-schema'
import type { WidgetProps } from '../../types/Widget'

import FormGenerator from './FormGenerator'
import type { Form as WidgetType } from './Form.type'
import { useDrawerContext } from '../Drawer/DrawerContext'
import { useEffect, useId, useRef } from 'react'
import { Button, Space } from 'antd'

export type FormWidgetData = WidgetType['spec']['widgetData']

function Form({ actions, widgetData, uid }: WidgetProps<FormWidgetData>) {
  const drawerContext = useDrawerContext()
  const alreadySetDrawerData = useRef(false)

  const formId = useId() /* https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#form */

  useEffect(() => {
    if (drawerContext.insideDrawer && !alreadySetDrawerData.current) {
      drawerContext.setDrawerData({
        title: 'Widget title',
        extra: (
          <Space>
            <Button type='default' form={formId} htmlType='reset'>
              Reset
            </Button>
            <Button type='primary' form={formId} htmlType='submit'>
              Save
            </Button>
          </Space>
        ),
      })
      alreadySetDrawerData.current = true
    }
  }, [drawerContext.insideDrawer])

  /* if the form is inside a Drawer, button will be already rendered in the Drawer  */
  const renderButtons = !drawerContext.insideDrawer

  return (
    <div>
      {renderButtons ? (
        <Space>
          <Button type='default' form={formId} htmlType='reset'>
            Reset
          </Button>
          <Button type='primary' form={formId} htmlType='submit'>
            Save
          </Button>
        </Space>
      ) : null}

      <FormGenerator formId={formId} descriptionTooltip={true} showFormStructure={true} schema={widgetData.schema as JSONSchema4} />
      {/* <pre>{JSON.stringify(widgetData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(actions, null, 2)}</pre> */}
    </div>
  )
}

export default Form
