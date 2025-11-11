import type { JSONSchema4 } from 'json-schema'

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
