/* eslint-disable no-console */
import { readFileSync, readdirSync } from 'node:fs'
import fs from 'node:fs/promises'
import { basename, join } from 'node:path'

import select from '@inquirer/select'
import chalk from 'chalk'
import { glob } from 'glob'

const WIDGETS_DIR = join(process.cwd(), 'src', 'widgets')

function getAvailableConfigs(): string[] {
  try {
    const configDir = join(process.cwd(), 'public', 'config')
    const files = readdirSync(configDir)

    return files
      .filter((file) => file.startsWith('config.') && file.endsWith('.json'))
      .map((file) => {
        const match = file.match(/^config\.(.+)\.json$/)
        return match ? match[1] : null
      })
      .filter((config): config is string => config !== null)
      .concat(files.includes('config.json') ? ['default'] : [])
      .sort()
  } catch (error) {
    console.error('Failed to read config directory')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

function getConfigSmitheryUrl(config: string): string {
  try {
    const configFileName = config === 'default' ? 'config.json' : `config.${config}.json`
    const configPath = join(process.cwd(), 'public', 'config', configFileName)
    const configData = JSON.parse(readFileSync(configPath, 'utf-8')) as { api: { SMITHERY_API_BASE_URL: string } }
    return configData.api?.SMITHERY_API_BASE_URL || 'Unknown'
  } catch {
    return 'Error reading config'
  }
}

async function selectConfig(): Promise<string> {
  try {
    const validConfigs = getAvailableConfigs()

    if (validConfigs.length === 0) {
      console.error('No config files found in public/config/')
      process.exit(1)
    }

    const choices = validConfigs.map((config) => {
      const apiUrl = getConfigSmitheryUrl(config)
      const configLabel =
        config === 'default' ? 'Default (config.json)' : `${config.charAt(0).toUpperCase() + config.slice(1)} (config.${config}.json)`
      return {
        name: `${configLabel} - ${chalk.gray(apiUrl)}`,
        value: config,
      }
    })

    return await select({
      choices,
      message: 'Select workspace configuration:',
    })
  } catch {
    console.error('Configuration selection cancelled')
    process.exit(1)
  }
}

function findLoginResponse(configType: string): { accessToken: string } {
  const scriptsDir = join(process.cwd(), 'scripts')

  try {
    const expectedFileName = configType === 'default' ? 'login-response.json' : `login-response.${configType}.json`
    const loginPath = join(scriptsDir, expectedFileName)

    console.log(`📄 Using login response: ${expectedFileName}`)
    return JSON.parse(readFileSync(loginPath, 'utf-8')) as { accessToken: string }
  } catch (error) {
    console.error(`\n❌ Failed to load login response for ${configType} workspace:`)
    console.error(error instanceof Error ? error.message : String(error))
    console.error(`\nPlease run: npm run get-access-token ${configType !== 'default' ? configType : ''}`)
    process.exit(1)
  }
}

function getConfig(configType: string): { api: { SMITHERY_API_BASE_URL: string } } {
  const configDir = join(process.cwd(), 'public', 'config')

  try {
    const configFileName = configType === 'default' ? 'config.json' : `config.${configType}.json`
    const configPath = join(configDir, configFileName)

    console.log(`⚙️  Using config: ${configFileName}`)
    return JSON.parse(readFileSync(configPath, 'utf-8')) as { api: { SMITHERY_API_BASE_URL: string } }
  } catch (error) {
    console.error(`\n❌ Failed to load config for ${configType} workspace:`)
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

async function sendSchemaToSmithery(schemaPath: string, api: { SMITHERY_API_BASE_URL: string }, accessToken: string, configType: string) {
  const forgeUrl = `${api.SMITHERY_API_BASE_URL}/forge?apply=true`
  const schemaName = basename(schemaPath)

  try {
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    // Parse and validate JSON before sending
    const response = await fetch(forgeUrl, {
      body: schemaContent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      console.error(`❌ Failed to send schema to Smithery (${schemaName})`, response.statusText)
      console.error(await response.text())
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const crdName = schemaName.replace('.schema.json', '.crd.yaml')
    await fs.writeFile(join('scripts', 'smithery-output', crdName), await response.text())

    console.log(schemaName, response.statusText)
  } catch (error) {
    if (error instanceof Error && error.message === 'fetch failed') {
      console.error(`❌ ${chalk.red('Connection failed:')} Could not send ${schemaName} to ${chalk.cyan(forgeUrl)}`)
      console.error(`   ${chalk.yellow('💡 Possible causes:')}`)
      console.error(`   • Smithery service is not running`)
      console.error(
        `   • Wrong port or URL in config (check ${chalk.cyan(`config.${configType === 'default' ? 'json' : `${configType}.json`}`)})`
      )
      console.error(`   • Network connectivity issues`)
      console.error(`   • Firewall blocking the connection`)
    } else {
      console.error(`❌ Failed to send schema ${schemaName}:`, error instanceof Error ? error.message : String(error))
    }
    throw error
  }
}

async function main() {
  try {
    const validConfigs = getAvailableConfigs()

    // eslint-disable-next-line prefer-destructuring
    let configType = process.argv[2]

    if (!configType) {
      if (process.stdout.isTTY) {
        configType = await selectConfig()
      } else {
        configType = 'default'
        console.log(`Using default config '${configType}' in non-interactive mode`)
      }
    } else if (!validConfigs.includes(configType)) {
      console.error(`Invalid config type: ${configType}. Valid options: ${validConfigs.join(', ')}`)
      process.exit(1)
    }

    console.log(chalk.blue(`🚀 Processing schemas for ${chalk.bold(configType)} workspace...`))

    const { accessToken } = findLoginResponse(configType)
    const { api } = getConfig(configType)

    console.log(chalk.gray(`   Smithery API: ${api.SMITHERY_API_BASE_URL}`))

    // Find all .schema.json files in the widgets directory
    const schemaFiles = await glob('**/*.schema.json', {
      absolute: true,
      cwd: WIDGETS_DIR,
    })

    if (schemaFiles.length === 0) {
      console.error('❌ No schema files found in:', WIDGETS_DIR)
      process.exit(1)
    }

    console.log(`Found ${schemaFiles.length} schema files to process`)

    let successCount = 0
    let failureCount = 0

    // Process each schema file
    for (const schemaFile of schemaFiles) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await sendSchemaToSmithery(schemaFile, api, accessToken, configType)
        successCount += 1
      } catch {
        failureCount += 1
      }
    }

    console.log('\n📊 Processing Summary:')
    console.log(`Total schemas: ${schemaFiles.length}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)

    if (failureCount > 0) {
      process.exit(1)
    }

    console.log('\n🎉 All schemas have been processed successfully!')
  } catch (error) {
    console.error('\n❌ Fatal Error:')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

void main()
