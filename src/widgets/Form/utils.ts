import type { FormInstance } from 'antd'

export const interpolateFormUrl = (template: string, form: FormInstance, context: Record<string, unknown> = {}): string => {
  return template.replace(/\${(.*?)}/g, (_: string, key: string) => {
    const path = key.trim()

    const rawValue = context[path] ?? form.getFieldValue(path) as unknown

    const value = typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean'
      ? String(rawValue)
      : ''

    return encodeURIComponent(value ?? '')
  })
}
