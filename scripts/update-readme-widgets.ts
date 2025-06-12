/* eslint-disable no-console */
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import glob from 'fast-glob'

import type { JSONSchema, WidgetDataSchema } from '../src/utils/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.join(__dirname, '../')
const WIDGETS_GLOB = 'src/widgets/**/**/*.schema.json'
const README_FILE = path.join(ROOT_DIR, 'README.md')
const WIDGETS_ANCHOR = '## Widgets'

function toMarkdownTable(widgetData: WidgetDataSchema): string {
  const lines = ['| Property | Required | Description | Type |', '|----------|----------|-------------|------|']

  if (!widgetData.properties) { return '*No props available.*' }

  function walk(
    schema: WidgetDataSchema,
    path: string = '',
  ) {
    const { properties = {}, required = [] } = schema

    for (const [key, prop] of Object.entries(properties)) {
      const fullPath = path ? `${path}.${key}` : key
      const isRequired = required.includes(key)
      const requiredText = isRequired ? 'yes' : 'no'

      let type = 'unknown'

      if (prop.enum) {
        type = prop.enum.map(value => `\`${value}\``).join(' \\| ')
      } else if (Array.isArray(prop.type)) {
        type = prop.type.join(' | ')
      } else if (prop.type === 'array') {
        type = 'array'
      } else if (prop.type === 'object') {
        type = 'object'
      } else if (typeof prop.type === 'string') {
        type = prop.type
      }

      const description = prop.description ?? ''
      lines.push(`| ${fullPath} | ${requiredText} | ${description} | ${type} |`)

      if (prop.type === 'object') {
        const nested = prop as WidgetDataSchema
        walk(nested, fullPath)
      }

      if (prop.type === 'array' && prop.items?.type === 'object' && 'properties' in prop.items) {
        const arrayItem = prop.items as WidgetDataSchema
        walk(arrayItem, `${fullPath}[]`)
      }
    }
  }

  walk(widgetData)
  return lines.join('\n')
}

function formatSchemaToMarkdown(schema: JSONSchema, filePath: string): string {
  const fileName = path.basename(filePath)
  const title
    = schema.title
    || schema.properties?.kind?.default
    || fileName.replace('.schema.json', '')
  const description = schema.description || schema.properties?.kind?.description || ''
  const widgetData = schema.properties?.spec?.properties?.widgetData

  const table = toMarkdownTable(widgetData ?? {})

  return `### ${title}\n\n${description}\n\n#### Props\n\n${table}\n`
}

async function generateWidgetsSection(): Promise<string> {
  const schemaPaths = await glob(WIDGETS_GLOB, { absolute: true, cwd: ROOT_DIR })
  if (schemaPaths.length === 0) {
    return `${WIDGETS_ANCHOR}\n\n⚠️ No widget schemas found at \`${WIDGETS_GLOB}\`\n`
  }

  const sortedSchemaPaths = schemaPaths.sort((schemaA, schemaB) =>
    path.basename(schemaA).localeCompare(path.basename(schemaB))
  )

  const docs = await Promise.all(
    sortedSchemaPaths.map(async file => {
      const content = await fs.readFile(file, 'utf-8')
      const schema: JSONSchema = JSON.parse(content) as JSONSchema
      return formatSchemaToMarkdown(schema, file)
    })
  )

  return `${WIDGETS_ANCHOR}\n\nList of implemented widgets:\n\n${docs.join('\n---\n\n')}`
}

async function updateReadme() {
  let readmeContent = ''
  try {
    readmeContent = await fs.readFile(README_FILE, 'utf-8')
  } catch {
    console.error('❌ README.md not found')
    process.exit(1)
  }

  const widgetsSection = await generateWidgetsSection()

  if (readmeContent.includes(WIDGETS_ANCHOR)) {
    const [beforeWidgets] = readmeContent.split(WIDGETS_ANCHOR)
    const updated = `${beforeWidgets}${widgetsSection}`
    await fs.writeFile(README_FILE, updated)
    console.log('✅ Widgets section updated in README.md')
  } else {
    const updated = `${readmeContent.trim()}\n\n${widgetsSection}`
    await fs.writeFile(README_FILE, updated)
    console.log('✅ Widgets section added to the end of README.md')
  }
}

updateReadme().catch(err => {
  console.error('❌ Error updating README:', err)
})
