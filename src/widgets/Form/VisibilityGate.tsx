import { Form, type FormInstance } from 'antd'
import { useMemo } from 'react'

import type { DisplayDependency } from './FormGenerator'
import { evaluateVisibility } from './utils'

type VisibilityGateProps = {
  children: React.ReactNode
  dependency?: DisplayDependency
  form: FormInstance
}

const VisibilityGate = ({
  children,
  dependency,
  form,
}: VisibilityGateProps) => {
  const watchedValue = Form.useWatch(
    dependency?.dependsOn.name?.split('.') ?? [],
    form,
  ) as unknown

  const isVisible = useMemo(() => evaluateVisibility(dependency, watchedValue), [dependency, watchedValue])

  if (!isVisible) {
    return null
  }

  return <>{children}</>
}

export default VisibilityGate
