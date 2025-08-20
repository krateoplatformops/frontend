/* eslint-disable no-template-curly-in-string */
import { describe, it, expect } from 'vitest'

import { formatMessage } from './formatMessage'
import { mockResponse, mockEvent } from './formatMessage.mock'

describe('formatMessage', () => {
  describe('json parameter', () => {
    it('should replace simple placeholders with json values', () => {
      const result = formatMessage('Successfully created ${.json.metadata.name} in ${.json.metadata.namespace}', {
        json: {
          metadata: {
            name: 'my-resource',
            namespace: 'default',
          },
        },
      })
      expect(result).toBe('Successfully created my-resource in default')
    })

    it('should handle deeply nested json paths', () => {
      const result = formatMessage('Version: ${.json.spec.version.major}.${.json.spec.version.minor}', {
        json: {
          spec: {
            version: {
              major: '2',
              minor: 1.3,
            },
          },
        },
      })
      expect(result).toBe('Version: 2.1.3')
    })

    it('should preserve placeholder when path does not exist', () => {
      const result = formatMessage('Name: ${.json.nonexistent.path}', {
        json: {
          metadata: {
            name: 'test',
          },
        },
      })
      expect(result).toBe('Name: ${.json.nonexistent.path}')
    })

    it('should preserve placeholder when top-level key is missing in values', () => {
      const result = formatMessage('Data: ${.missingKey.someField}', {
        json: {
          existingKey: 'value',
        },
      })
      expect(result).toBe('Data: ${.missingKey.someField}')
    })
  })

  describe('event parameter', () => {
    it('should replace placeholders with event values', () => {
      const result = formatMessage('Event on ${.event.involvedObject.name} in ${.event.involvedObject.namespace}', {
        event: {
          involvedObject: {
            name: 'pod-123',
            namespace: 'production',
          },
        },
      })
      expect(result).toBe('Event on pod-123 in production')
    })

    it('should handle missing event gracefully', () => {
      const result = formatMessage('Event: ${.event.type}', {})
      expect(result).toBe('Event: ${.event.type}')
    })
  })

  describe('response parameter', () => {
    it('should replace placeholders with response values', () => {
      const result = formatMessage('API returned status: ${.response.status} with id: ${.response.data.id}', {
        response: {
          data: {
            id: 'abc123',
          },
          status: 200,
        },
      })
      expect(result).toBe('API returned status: 200 with id: abc123')
    })
  })

  describe('multiple data sources', () => {
    it('should handle placeholders from different sources', () => {
      const result = formatMessage('Created ${.json.name} with status ${.response.status} for event ${.event.type}', {
        event: {
          type: 'CREATE',
        },
        json: {
          name: 'my-resource',
        },
        response: {
          status: 201,
        },
      })
      expect(result).toBe('Created my-resource with status 201 for event CREATE')
    })

    it('should preserve unmatched placeholders when mixing sources', () => {
      const result = formatMessage('${.json.name} - ${.response.missing} - ${.event.type}', {
        event: {
          type: 'UPDATE',
        },
        json: {
          name: 'test',
        },
      })
      expect(result).toBe('test - ${.response.missing} - UPDATE')
    })
  })

  describe('edge cases', () => {
    it('should handle null values by preserving placeholder', () => {
      const result = formatMessage('Value: ${.json.nullValue}', {
        json: {
          nullValue: null,
        },
      })
      expect(result).toBe('Value: null')
    })

    it('should handle undefined values by preserving placeholder', () => {
      const result = formatMessage('Value: ${.json.undefinedValue}', {
        json: {
          undefinedValue: undefined,
        },
      })
      expect(result).toBe('Value: ${.json.undefinedValue}')
    })

    it('should handle boolean values', () => {
      const result = formatMessage('Active: ${.json.isActive}, Disabled: ${.json.isDisabled}', {
        json: {
          isActive: true,
          isDisabled: false,
        },
      })
      expect(result).toBe('Active: true, Disabled: false')
    })

    it('should handle number values', () => {
      const result = formatMessage('Count: ${.json.count}, Price: ${.json.price}', {
        json: {
          count: 42,
          price: 19.99,
        },
      })
      expect(result).toBe('Count: 42, Price: 19.99')
    })

    it('should handle array values with JSON.stringify', () => {
      const result = formatMessage('Items: ${.json.items}', {
        json: {
          items: ['a', 'b', 'c'],
        },
      })
      expect(result).toBe('Items: ["a","b","c"]')
    })

    it('should handle object values with JSON.stringify', () => {
      const result = formatMessage('Config: ${.json.config}', {
        json: {
          config: {
            key: 'value',
            nested: {
              prop: 123,
            },
          },
        },
      })
      expect(result).toBe('Config: {"key":"value","nested":{"prop":123}}')
    })

    it('should handle empty string values', () => {
      const result = formatMessage('Name: "${.json.name}"', {
        json: {
          name: '',
        },
      })
      expect(result).toBe('Name: ""')
    })

    it('should handle messages without placeholders', () => {
      const result = formatMessage('This is a plain message', {
        json: {
          test: 'value',
        },
      })
      expect(result).toBe('This is a plain message')
    })

    it('should handle empty message', () => {
      const result = formatMessage('', {})
      expect(result).toBe('')
    })

    it('should ignore placeholders without dot notation', () => {
      const result = formatMessage('Invalid: ${json.name} Valid: ${.json.name}', {
        json: {
          name: 'test',
        },
      })
      expect(result).toBe('Invalid: ${json.name} Valid: test')
    })

    it('should leave non-interpolated placeholders as-is', () => {
      const result = formatMessage('Keep these: ${someVar} ${anotherVar} but replace ${.json.name}', {
        json: {
          name: 'replaced',
        },
      })
      expect(result).toBe('Keep these: ${someVar} ${anotherVar} but replace replaced')
    })

    it('should handle placeholders with extra spaces', () => {
      const result = formatMessage('Name: ${ .json.name } and ${  .json.type  }', {
        json: {
          name: 'app',
          type: 'service',
        },
      })
      expect(result).toBe('Name: app and service')
    })

    it('should handle zero values correctly', () => {
      const result = formatMessage('Count: ${.json.count}', {
        json: {
          count: 0,
        },
      })
      expect(result).toBe('Count: 0')
    })

    it('should handle all parameters being undefined', () => {
      const result = formatMessage('${.json.value} ${.response.value} ${.event.value}', {})
      expect(result).toBe('${.json.value} ${.response.value} ${.event.value}')
    })

    it('should handle null root objects gracefully', () => {
      const result = formatMessage('${.json.name} ${.response.status}', {
        json: null,
        response: null,
      })
      expect(result).toBe('${.json.name} ${.response.status}')
    })

    it('should handle undefined root objects gracefully', () => {
      const result = formatMessage('${.json.name} ${.response.status}', {
        json: undefined,
        response: undefined,
      })
      expect(result).toBe('${.json.name} ${.response.status}')
    })

    it('should handle mixed null/undefined/valid root objects', () => {
      const result = formatMessage('${.json.name} ${.response.status} ${.event.type}', {
        event: { type: 'CREATE' },
        json: null,
        response: undefined,
      })
      expect(result).toBe('${.json.name} ${.response.status} CREATE')
    })
  })

  describe('complex scenarios', () => {
    it('should handle real-world Kubernetes resource example', () => {
      const result = formatMessage(
        'Successfully created ${.json.metadata.name} in ${.json.metadata.namespace} with ${.json.spec.replicas} replicas',
        {
          json: {
            metadata: {
              name: 'nginx-deployment',
              namespace: 'web-apps',
            },
            spec: {
              replicas: 3,
            },
          },
        }
      )
      expect(result).toBe('Successfully created nginx-deployment in web-apps with 3 replicas')
    })

    it('should handle error event scenario', () => {
      const result = formatMessage(
        'Failed to update ${.event.involvedObject.name}: ${.response.error.message} (code: ${.response.error.code})',
        {
          event: {
            involvedObject: {
              name: 'database-pod',
            },
          },
          response: {
            error: {
              code: 409,
              message: 'Resource conflict',
            },
          },
        }
      )
      expect(result).toBe('Failed to update database-pod: Resource conflict (code: 409)')
    })
  })

  describe('tests with mock data', () => {
    it('should format message with mockResponse metadata', () => {
      const result = formatMessage('Created ${.response.metadata.name} in namespace ${.response.metadata.namespace}', {
        response: mockResponse,
      })
      expect(result).toBe('Created aa in namespace demo-system')
    })

    it('should format message with mockResponse spec data', () => {
      const result = formatMessage(
        'Git repo ${.response.spec.git.toRepo.name} in org ${.response.spec.git.toRepo.org} with branch ${.response.spec.git.toRepo.branch}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('Git repo test-x in org krateoplatformops-test with branch main')
    })

    it('should format message with mockResponse argocd configuration', () => {
      const result = formatMessage(
        'ArgoCD app in namespace ${.response.spec.argocd.application.destination.namespace} with project ${.response.spec.argocd.application.project}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('ArgoCD app in namespace fireworks-app with project default')
    })

    it('should format message with mockResponse service config', () => {
      const result = formatMessage(
        'Service configured with type ${.response.spec.app.service.type} on port ${.response.spec.app.service.port}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('Service configured with type NodePort on port 31180')
    })

    it('should format message with mockEvent data', () => {
      const result = formatMessage('Event: ${.event.message} for ${.event.involvedObject.name} in ${.event.involvedObject.namespace}', {
        event: mockEvent,
      })
      expect(result).toBe('Event: Updated composition: test3 for test3 in demo-system')
    })

    it('should format message with mockEvent metadata', () => {
      const result = formatMessage('Event ${.event.metadata.name} with type ${.event.type} and reason ${.event.reason}', {
        event: mockEvent,
      })
      expect(result).toBe('Event test3.185d6a1766416b66 with type Normal and reason CompositionUpdated')
    })

    it('should format message with mockEvent series count', () => {
      const result = formatMessage('Event occurred ${.event.series.count} times, last observed at ${.event.series.lastObservedTime}', {
        event: mockEvent,
      })
      expect(result).toBe('Event occurred 3 times, last observed at 2025-08-20T07:59:52.920509Z')
    })

    it('should format message with both mockResponse and mockEvent', () => {
      const result = formatMessage('Resource ${.response.metadata.name} (${.response.kind}) received event: ${.event.message}', {
        event: mockEvent,
        response: mockResponse,
      })
      expect(result).toBe('Resource aa (FrontendGithubScaffolding) received event: Updated composition: test3')
    })

    it('should format message with nested mockResponse git credentials', () => {
      const result = formatMessage(
        'Using secret ${.response.spec.git.toRepo.credentials.secretRef.name} from namespace ${.response.spec.git.toRepo.credentials.secretRef.namespace}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('Using secret github-repo-creds from namespace krateo-system')
    })

    it('should format message with mockResponse creation timestamp', () => {
      const result = formatMessage('Resource created at: ${.response.metadata.creationTimestamp}', {
        response: mockResponse,
      })
      expect(result).toBe('Resource created at: 2025-08-05T10:03:02Z')
    })

    it('should format message with mockResponse sync policy', () => {
      const result = formatMessage(
        'Automated sync enabled: prune=${.response.spec.argocd.application.syncPolicy.automated.prune}, selfHeal=${.response.spec.argocd.application.syncPolicy.automated.selfHeal}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('Automated sync enabled: prune=true, selfHeal=true')
    })

    it('should format complex message with multiple mock data fields', () => {
      const result = formatMessage(
        'Scaffolding ${.response.spec.git.fromRepo.name} to ${.response.spec.git.toRepo.name} for composition ${.response.spec.composition.name} triggered by ${.event.reportingComponent}',
        {
          event: mockEvent,
          response: mockResponse,
        }
      )
      expect(result).toBe(
        'Scaffolding frontend-github-scaffolding-blueprint to test-x for composition aa triggered by composition-dynamic-controller'
      )
    })

    it('should handle JSON.stringify for complex objects from mockResponse', () => {
      const result = formatMessage('Managed fields: ${.response.metadata.managedFields}', {
        response: mockResponse,
      })
      expect(result).toBe(
        'Managed fields: [{"apiVersion":"composition.krateo.io/v0-0-1","fieldsType":"FieldsV1","manager":"Go-http-client","operation":"Update","time":"2025-08-05T10:03:02Z"}]'
      )
    })

    it('should handle boolean values from mockResponse', () => {
      const result = formatMessage(
        'Repository settings: private=${.response.spec.git.toRepo.private}, insecure=${.response.spec.git.insecure}, verbose=${.response.spec.git.toRepo.verbose}',
        {
          response: mockResponse,
        }
      )
      expect(result).toBe('Repository settings: private=false, insecure=true, verbose=false')
    })

    it('should format UIDs from mock data', () => {
      const result = formatMessage('Resource UID: ${.response.metadata.uid}, Event UID: ${.event.metadata.uid}', {
        event: mockEvent,
        response: mockResponse,
      })
      expect(result).toBe('Resource UID: 5089daa9-d4dc-4d6f-b0cf-f71d9695b705, Event UID: debe60f7-884a-4090-97d1-ef8dd350c371')
    })
  })
})
