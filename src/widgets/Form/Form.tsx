
import {JSONSchema4} from 'json-schema';
import type {WidgetProps} from '../../types/Widget';

import type {Form as WidgetType} from './Form.type';
import FormGenerator from './FormGenerator';
export type FormWidgetData = WidgetType['spec']['widgetData']

function Form({ actions, widgetData }: WidgetProps<FormWidgetData>) {

/* 
  todos: 
  - get required fields
  - get fields (are one level deep, thankfully)
  - handle onSuccessNavigateTo
 */

  return (
    <div>
      <pre>{JSON.stringify(widgetData, null, 2)}</pre>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
      <FormGenerator title="Widget title" description={"widget description"}
       descriptionTooltip={true} 
       showFormStructure={true} 
       schema={widgetData.schema as JSONSchema4}
       />
    </div>
  )
}

export default Form
