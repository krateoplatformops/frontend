import type { DefaultOptionType } from 'antd/es/select'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'

import type { DisplayDependency } from './FormGenerator'

const isOptionValue = (value: unknown): value is { label?: string; value: string | number | boolean } => {
  return (typeof value === 'object' && value !== null && 'value' in value)
}

export const evaluateVisibility = (dependency: DisplayDependency | undefined, dependencyValue: unknown): boolean => {
  if (!dependency) {
    return true
  }

  if (dependency.dependsOn.conditionType === 'notEmpty') {
    if (dependencyValue === undefined || dependencyValue === null) {
      return false
    }

    if (typeof dependencyValue === 'string') {
      return dependencyValue.trim().length > 0
    }

    if (Array.isArray(dependencyValue)) {
      return dependencyValue.length > 0
    }

    return true
  }

  if (dependency.dependsOn.conditionType === 'value') {
    const expected = dependency.dependsOn.value
    if (!expected) {
      return true
    }

    switch (expected.type) {
      case 'string':
        return dependencyValue === expected.stringValue
      case 'integer':
        return dependencyValue === expected.integerValue
      case 'boolean':
        return dependencyValue === expected.booleanValue
      case 'array':
        return JSON.stringify(dependencyValue) === JSON.stringify(expected.arrayValue)
      case 'option': {
        const expectedValue = expected.optionValue?.value

        // { label, value }
        if (isOptionValue(dependencyValue)) {
          return String(dependencyValue.value) === String(expectedValue)
        }

        // ['a', 'b']
        if (Array.isArray(dependencyValue)) {
          const expectedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue]

          return (
            dependencyValue.length === expectedValues.length
            && expectedValues.every(expectedItem => dependencyValue.includes(String(expectedItem)))
          )
        }

        // 'a' | 1 | true
        return String(dependencyValue) === String(expectedValue)
      }
      case 'null':
        return dependencyValue === null
      default:
        return true
    }
  }

  return true
}

export const getDefaultsFromSchema = (schema: JSONSchema4): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {}

  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const node = prop
      if (node.type === 'object') {
        defaults[key] = getDefaultsFromSchema(node)
      } else if (node.default !== undefined) {
        defaults[key] = node.default
      }
    }
  }

  return defaults
}

export const getOptionsFromEnum = (enumValues: JSONSchema4Type[] | undefined): DefaultOptionType[] | undefined => {
  if (!Array.isArray(enumValues)) { return undefined }

  return enumValues
    .filter((value): value is string | number => typeof value === 'string' || typeof value === 'number')
    .map((value) => ({ label: String(value), value }))
}

export const isObjectSchema = (property: JSONSchema4) => {
  return property.type === 'object'
    || (Array.isArray(property.type) && property.type.includes('object'))
    || (!!property.properties && typeof property.properties === 'object')
}

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
