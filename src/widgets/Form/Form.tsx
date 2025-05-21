import { Form as AntdForm, Button, Input } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import type { Form as WidgetType } from './Form.type'

type WidgetData = WidgetType['spec']['widgetData']

function Form({ actions, widgetData }: WidgetProps<WidgetData>) {
  return (
    <div>
      <AntdForm>
        <AntdForm.Item name='name'>
          <Input />
        </AntdForm.Item>
        <Button onClick={() => alert('send')}>Send</Button>
      </AntdForm>

      <pre>{JSON.stringify(widgetData, null, 2)}</pre>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
    </div>
  )
}

export default Form
