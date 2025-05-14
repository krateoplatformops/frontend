import { Form as AntdForm, Button, Input } from 'antd'

import type { WidgetProps } from '../../types/Widget'

function Form({ widgetData, actions }: WidgetProps) {
  return (
    <div>
      <AntdForm>
        <AntdForm.Item name="name">
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
