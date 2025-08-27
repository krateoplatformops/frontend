export const mockResponse = {
  apiVersion: 'composition.krateo.io/v0-0-1',
  kind: 'FrontendGithubScaffolding',
  metadata: {
    creationTimestamp: '2025-08-05T10:03:02Z',
    generation: 1,
    labels: {
      'krateo.io/composition-version': 'v0-0-1',
    },
    managedFields: [
      {
        apiVersion: 'composition.krateo.io/v0-0-1',
        fieldsType: 'FieldsV1',
        manager: 'Go-http-client',
        operation: 'Update',
        time: '2025-08-05T10:03:02Z',
      },
    ],
    name: 'aa',
    namespace: 'demo-system',
    resourceVersion: '13739230',
    uid: '5089daa9-d4dc-4d6f-b0cf-f71d9695b705',
  },
  spec: {
    app: {
      service: {
        port: 31180,
        type: 'NodePort',
      },
    },
    argocd: {
      application: {
        destination: {
          namespace: 'fireworks-app',
          server: 'https://kubernetes.default.svc',
        },
        project: 'default',
        source: {
          path: 'chart/',
        },
        syncPolicy: {
          automated: {
            prune: true,
            selfHeal: true,
          },
        },
      },
      namespace: 'krateo-system',
    },
    composition: {
      name: 'aa',
      namespace: 'demo-system',
    },
    git: {
      fromRepo: {
        branch: 'main',
        credentials: {
          authMethod: 'generic',
          secretRef: {
            key: 'token',
            name: 'github-repo-creds',
            namespace: 'krateo-system',
          },
        },
        name: 'frontend-github-scaffolding-blueprint',
        org: 'krateoplatformops-blueprints',
        path: 'skeleton/',
        scmUrl: 'https://github.com',
      },
      insecure: true,
      toRepo: {
        branch: 'main',
        credentials: {
          authMethod: 'generic',
          secretRef: {
            key: 'token',
            name: 'github-repo-creds',
            namespace: 'krateo-system',
          },
        },
        deletionPolicy: 'Delete',
        initialize: true,
        name: 'test-x',
        org: 'krateoplatformops-test',
        path: '/',
        private: false,
        scmUrl: 'https://github.com',
        verbose: false,
      },
      unsupportedCapabilities: true,
    },
  },
} as const

export const mockEvent = {
  action: 'Update',
  eventTime: '2025-08-20T07:47:58.476713Z',
  firstTimestamp: null,
  involvedObject: {
    apiVersion: 'composition.krateo.io/v0-0-1',
    kind: 'FrontendGithubScaffolding',
    name: 'test3',
    namespace: 'demo-system',
    resourceVersion: '13673863',
    uid: '4b334985-1c72-4e85-8c95-53a9d1ac92ca',
  },
  lastTimestamp: null,
  message: 'Updated composition: test3',
  metadata: {
    creationTimestamp: '2025-08-20T07:47:58Z',
    labels: {
      'krateo.io/composition-id': '',
    },
    managedFields: [
      {
        apiVersion: 'events.k8s.io/v1',
        fieldsType: 'FieldsV1',
        manager: 'controller',
        operation: 'Update',
        time: '2025-08-20T08:09:52Z',
      },
    ],
    name: 'test3.185d6a1766416b66',
    namespace: 'demo-system',
    resourceVersion: '13685692',
    uid: 'debe60f7-884a-4090-97d1-ef8dd350c371',
  },
  reason: 'CompositionUpdated',
  reportingComponent: 'composition-dynamic-controller',
  reportingInstance: 'composition-dynamic-controller-frontendgithubscaffoldings-v0-0-1-controller-5c5699f8cc-49bgv',
  series: {
    count: 3,
    lastObservedTime: '2025-08-20T07:59:52.920509Z',
  },
  source: {},
  type: 'Normal',
} as const
