/**
 * Converts a dotted string path (e.g., "a.b.c") into a nested object structure,
 * assigning the given value to the innermost key.
 *
 * Example:
 *   convertStringToObject("user.name", "Alice")
 *   → { user: { name: "Alice" } }
 */
export const convertStringToObject = (dottedString: string, value: unknown): Record<string, unknown> => {
  const keys = dottedString.split('.')
  const result: Record<string, unknown> = {}
  let current: Record<string, unknown> = result

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
    } else {
      if (typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {}
      }

      current = current[key] as Record<string, unknown>
    }
  })

  return result
}

/**
 * Adds or replaces `name` and `namespace` query parameters in a given URL.
 * Existing `name` and `namespace` parameters (if any) are removed before appending the new values.
 *
 * Example:
 *   updateNameNamespace("/api?foo=bar&name=old", "my-app", "prod")
 *   → "/api?foo=bar&name=my-app&namespace=prod"
 */
export const updateNameNamespace = (path: string, name: string, namespace: string) => {
  const qsParameters = path
    .split('?')[1]
    .split('&')
    .filter((el) => el.indexOf('name=') === -1 && el.indexOf('namespace=') === -1)
    .join('&')

  return `${path.split('?')[0]}?${qsParameters}&name=${name}&namespace=${namespace}`
}

/**
 * Interpolates a route template using values from a nested payload object.
 * Placeholders in the route must follow the format `${path.to.value}`.
 * If any placeholder cannot be resolved or is not a primitive, the function returns null.
 *
 * Example:
 *   interpolateRedirectUrl({ user: { id: 123 } }, "/profile/${user.id}")
 *   → "/profile/123"
 */
export const interpolateRedirectUrl = (payload: Record<string, unknown>, route: string): string | null => {
  let allReplacementsSuccessful = true

  const interpolatedRoute = route.replace(/\$\{([^}]+)\}/g, (_, key: string) => {
    const parts = key.split('.')

    let value: unknown = payload
    for (const part of parts) {
      if (typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(value, part)) {
        value = (value as Record<string, unknown>)[part]
      } else {
        value = undefined
        break
      }
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint'
      || typeof value === 'symbol') {
      return String(value)
    }

    allReplacementsSuccessful = false
    return ''
  })

  return allReplacementsSuccessful ? interpolatedRoute : null
}
