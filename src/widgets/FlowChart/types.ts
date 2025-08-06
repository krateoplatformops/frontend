import type { Node } from 'reactflow'

interface HealthStatus {
  message?: string
  reason?: string
  status?: string
  type?: string
}

export interface FlowChartElement {
  uid: string
  createdAt: string
  icon?: string
  kind: string
  name: string
  namespace: string
  status?: string
  version: string
  health?: HealthStatus
  parentRefs?: Array<{
    uid?: string
    [key: string]: unknown
  }>
}

export interface NodeElementData {
  date: string
  icon?: {
    name: string
    color: string
    message?: string
  }
  statusIcon?: {
    name: string
    color: string
    message?: string
  }
  kind: string
  name: string
  namespace: string
  status?: string
  version: string
}

export type NodeElement = Node<NodeElementData> & {
  type: 'nodeElement'
}
