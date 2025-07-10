import dayjs from 'dayjs'
import merge from 'lodash/merge'

/**
 * Converts a dotted string path (e.g., "a.b.c") into a nested object structure,
 * assigning the given value to the innermost key.
 *
 * Example:
 *   convertStringToObject("user.name", "Alice")
 *   → { user: { name: "Alice" } }
 *
 * @param dottedString - The dotted path string representing the nested object keys
 * @param value - The value to assign at the final nested key
 * @returns A nested object with the specified value at the correct path
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
 * Returns a new object where all Dayjs instances in a flat input object
 * are converted into ISO 8601 string format using `.toISOString()`.
 *
 * This function does not mutate the original object. It returns a shallow copy
 * of the input where any Dayjs values are stringified.
 *
 * @param values - A flat object with values that may include Dayjs instances
 * @returns A new object with Dayjs instances converted to ISO strings
 */
export const convertDayjsToISOString = (values: object): object => {
  const result: Record<string, unknown> = {}

  Object.entries(values as Record<string, unknown>).forEach(([key, value]) => {
    if (dayjs.isDayjs(value)) {
      result[key] = value.toISOString()
    } else {
      result[key] = value
    }
  })

  return result
}

/**
 * Retrieves a nested value from an object using a dot-separated path string.
 *
 * The function safely traverses the object structure and returns the value found at the given path.
 * If any segment in the path does not exist or is not an object, it returns `undefined`.
 *
 * Example:
 *   getObjectByPath({ user: { profile: { id: 42 } } }, "user.profile.id")
 *   → 42
 *
 * @param obj - The object to traverse.
 * @param path - A dot-separated string path representing the property to access (e.g., "user.profile.id").
 * @returns The value found at the given path, or `undefined` if the path is invalid.
 */
export const getObjectByPath = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (typeof acc === 'object' && acc !== null && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

/**
 * Updates a nested property in an object at the given key path with a value derived from another path expression.
 *
 * The valuePath can include expressions like: ${user.firstName + " " + user.lastName}
 *
 * @param values - The source object from which to extract values.
 * @param keyPath - Dot-separated path where to set the new value.
 * @param valuePath - A template-style string (e.g., "${user.firstName + ' ' + user.lastName}") used to build the new value.
 * @returns A new object with the updated keyPath set to the interpolated value.
 */
export const updateJson = (values: Record<string, unknown>, keyPath: string, valuePath: string): Record<string, unknown> => {
  const substr = valuePath.replace('${', '').replace('}', '')
  const parts = substr.split('+').map((el) => el.trim())

  const value = parts
    .map((el) => {
      if (el.startsWith('"') || el.startsWith("'")) {
        return el.replace(/^['"]|['"]$/g, '')
      }

      const resolved = getObjectByPath(values, el)
      if (typeof resolved === 'string' || typeof resolved === 'number' || typeof resolved === 'boolean'
        || typeof resolved === 'bigint' || typeof resolved === 'symbol') {
        return String(resolved)
      }

      return ''
    })
    .join('')

  return merge({}, values, convertStringToObject(keyPath, value))
}

/**
 * Adds or replaces `name` and `namespace` query parameters in a given URL.
 * Existing `name` and `namespace` parameters (if any) are removed before appending the new values.
 *
 * Example:
 *   updateNameNamespace("/api?foo=bar&name=old", "my-app", "prod")
 *   → "/api?foo=bar&name=my-app&namespace=prod"
 *
 * @param path - The original URL (may already include query parameters)
 * @param name - The new `name` parameter to set
 * @param namespace - The new `namespace` parameter to set
 * @returns The updated URL with the new query parameters
 */
export const updateNameNamespace = (path: string, name?: string, namespace?: string) => {
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
 *
 * @param payload - The object used to resolve placeholders (supports nested values)
 * @param route - The route string containing `${...}` placeholders to be replaced
 * @returns The interpolated route string or null if a placeholder could not be resolved
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
