import { Form, type FormInstance } from 'antd'

import type { DisplayDependency } from '../widgets/Form/FormGenerator'
import { evaluateVisibility } from '../widgets/Form/utils'

export const useFieldVisibility = (dependency: DisplayDependency | undefined, form: FormInstance) => {
  const watchedValue = Form.useWatch(
    dependency?.dependsOn.name?.split('.') ?? [],
    form,
  ) as unknown

  return evaluateVisibility(dependency, watchedValue)
}
