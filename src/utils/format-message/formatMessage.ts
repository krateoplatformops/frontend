const knownKeys = ['json', 'response', 'event'] as const
type KnownKeys = (typeof knownKeys)[number]
type FormatMessageValues = Partial<Record<KnownKeys, null | undefined | Record<string, unknown>>>

const isKnownKey = (key: string): key is KnownKeys => knownKeys.includes(key as KnownKeys)

/**
 * Formats a message by replacing placeholders with actual values from the provided data object.
 * @param rawMessage - The message template containing placeholders like ${.json.field.name}
 * @param values - Object containing the actual data (json, response, event) to replace placeholders
 * @returns The formatted message with placeholders replaced by actual values
 */
export function formatMessage(rawMessage: string, values: FormatMessageValues) {
  // use regex to find all placeholders in the format ${...} and replace them
  // the regex /\$\{([^}]+)\}/g matches ${anything-except-closing-brace}
  return rawMessage.replace(/\$\{([^}]+)\}/g, (match, path: string): string => {
    // remove any whitespace from the captured path
    const trimmedPath = path.trim()

    // only process paths that start with a dot (e.g., .json.field)
    // if it doesn't start with a dot, return the original placeholder unchanged
    if (!trimmedPath.startsWith('.')) {
      return match
    }

    // remove the leading dot and split the path into segments
    // ".json.user.name" becomes ["json", "user", "name"]
    const pathParts = trimmedPath.substring(1).split('.')

    // check if the first part is a valid known key (json, response, or event)
    const [rootKey, ...restPath] = pathParts
    if (!rootKey || !isKnownKey(rootKey)) {
      // invalid root key - warn and return the original placeholder
      console.warn(`formatMessage: Unknown root key "${rootKey}" in placeholder "${match}". Expected one of: ${knownKeys.join(', ')}`)
      return match
    }

    // start traversing from the specific root object (json, response, or event)
    let value: unknown = values[rootKey]

    // if the root key doesn't exist in values or is null/undefined, return the original placeholder
    if (value === null || value === undefined) {
      return match
    }

    // navigate through the remaining segments of the path to find the target value
    for (const part of restPath) {
      // check if current value is an object and has the property we're looking for
      if (value && typeof value === 'object' && part in value) {
        // move deeper into the object structure
        value = (value as Record<string, unknown>)[part]
      } else {
        // path doesn't exist - warn and return the original placeholder
        console.warn(`formatMessage: Path "${trimmedPath}" not found in values. Failed at segment "${part}"`)
        return match
      }
    }

    if (value === undefined) {
      // this will preserve the placeholder if the value is undefined
      // e.g. ${.json.nonexistent.path} will be preserved as is
      console.warn(`formatMessage: Value at path "${trimmedPath}" is undefined`)
      return match
    }

    // objects are stringified as JSON, primitives are converted to string, null values will be converted to 'null' string
    return typeof value === 'object' ? JSON.stringify(value) : String(value as unknown)
  })
}
