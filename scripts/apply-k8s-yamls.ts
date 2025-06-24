/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { glob } from 'glob'

const WIDGETS_DIR = join(process.cwd(), 'src', 'widgets')

function getCurrentKubeContext(): string {
  try {
    const context = execSync('kubectl config current-context', { encoding: 'utf-8' }).trim()
    return context
  } catch (error) {
    console.error('❌ Failed to get current kubectl context')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

async function confirmKubeContext(): Promise<void> {
  try {
    const currentContext = getCurrentKubeContext()

    // Get kubeconfig path, always show absolute path for clarity
    let kubeconfigPath: string
    if (process.env.KUBECONFIG) {
      // If KUBECONFIG is relative, resolve to absolute path
      kubeconfigPath = resolve(process.env.KUBECONFIG)
    } else {
      const defaultPath = join(homedir(), '.kube', 'config')
      kubeconfigPath = defaultPath.replace(homedir(), '~')
    }

    console.log(chalk.blue(`🔧 Current kubectl context: ${chalk.bold(currentContext)}`))
    if (process.env.KUBECONFIG) {
      console.log(chalk.gray(`📁 KUBECONFIG (from env): ${kubeconfigPath}`))
    } else {
      console.log(chalk.gray(`📁 KUBECONFIG (default): ${kubeconfigPath}`))
    }

    const shouldContinue = await confirm({
      default: false,
      message: 'Do you want to apply YAML files to this Kubernetes context?',
    })

    if (!shouldContinue) {
      console.log(chalk.yellow('❌ Operation cancelled by user'))
      process.exit(0)
    }
  } catch {
    console.error('Confirmation cancelled')
    process.exit(1)
  }
}

function applyYamlFile(yamlPath: string): boolean {
  try {
    console.log(`Applying ${yamlPath.split('/').pop()}...`)
    execSync(`kubectl apply -f ${yamlPath}`, { stdio: 'inherit' })
    console.log(`✅ Successfully applied ${yamlPath.split('/').pop()}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to apply ${yamlPath.split('/').pop()}:`, error)
    return false
  }
}

async function main() {
  try {
    await confirmKubeContext()

    console.log(chalk.blue('🚀 Applying YAML files...'))

    // Find all .yaml and .yml files in the widgets directory (exclude those who start with example)
    const yamlFiles = await glob('**/!(*.example).@(yaml|yml)', {
      absolute: true,
      cwd: WIDGETS_DIR,
      nocase: true,
    })

    if (yamlFiles.length === 0) {
      console.error('❌ No YAML files found in:', WIDGETS_DIR)
      process.exit(1)
    }

    console.log(`Found ${yamlFiles.length} YAML files to process`)

    let successCount = 0
    let failureCount = 0

    // Process each YAML file
    for (const yamlFile of yamlFiles) {
      const success = applyYamlFile(yamlFile)
      if (success) {
        successCount += 1
      } else {
        failureCount += 1
      }
    }

    console.log('\n📊 Processing Summary:')
    console.log(`Total YAML files: ${yamlFiles.length}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)

    if (failureCount > 0) {
      process.exit(1)
    }

    console.log('\n🎉 All YAML files have been applied successfully!')
  } catch (error) {
    console.error('\n❌ Fatal Error:')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

void main()
