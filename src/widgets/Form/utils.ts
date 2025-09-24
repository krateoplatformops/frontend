import type { FormInstance } from 'antd'
import dayjs from 'dayjs'

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

/**
 * Returns a new object where all Dayjs instances in a flat input object
 * are converted into ISO 8601 string format using `.toISOString()`.
 *
 * This function does not mutate the original object. It returns a shallow copy
 * of the input where any Dayjs values are stringified.
 *
 * @param values - A flat object with values that may include Dayjs instances
 * @returns A new object with Dayjs instances converted to ISO strings
 */
export const convertDayjsToISOString = (values: Record<string, unknown>) => {
  const result: Record<string, unknown> = {}

  Object.entries(values).forEach(([key, value]) => {
    if (dayjs.isDayjs(value)) {
      result[key] = value.toISOString()
    } else {
      result[key] = value
    }
  })

  return result
}
