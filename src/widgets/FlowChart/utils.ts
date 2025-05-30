import type { Edge } from 'reactflow'

import type { FlowChartElement, NodeElement } from './types'

export const getNormalizedLabel = (label: string | boolean): string | boolean => {
  const strLabel = String(label).toLowerCase()

  if (strLabel === 'true') { return 'Healthy' }
  if (strLabel === 'false') { return 'Degraded' }

  return label
}

export const getDaysPeriodFromISO = (isoDate: string) => {
  const deltaMSeconds = (new Date()).getTime() - (new Date(isoDate)).getTime()
  const deltaDays = Math.floor(deltaMSeconds / 24 / 60 / 60 / 1000)

  return deltaDays
}

export const getDaysPeriod = (isoDate: string) => {
  const days = getDaysPeriodFromISO(isoDate)
  return (days !== 1) ? `${days} days` : `${days} day`
}

export const parseGraphData = (data: string | undefined): { parsedNodes: NodeElement[]; parsedEdges: Edge[] } => {
  let parsedNodes: NodeElement[] = []
  let parsedEdges: Edge[] = []

  if (data) {
    try {
      const flowChartElements: FlowChartElement[] = JSON.parse(data) as FlowChartElement[]

      parsedNodes = flowChartElements.map(({
        createdAt,
        health,
        icon,
        kind,
        name,
        namespace,
        status,
        uid,
        version,
      }): NodeElement => ({
        data: {
          date: createdAt,
          health: health ?? {},
          icon,
          kind,
          name,
          namespace,
          status,
          version,
        },
        id: uid,
        position: { x: 0, y: 0 },
        type: 'nodeElement',
      }))

      parsedEdges = flowChartElements.flatMap(({ parentRefs, uid }) => {
        if (!parentRefs || !Array.isArray(parentRefs)) { return [] }

        return parentRefs
          .filter((ref): ref is { uid: string } => typeof ref?.uid === 'string')
          .map((ref) => ({
            id: `${ref.uid}-${uid}`,
            label: '',
            source: ref.uid,
            target: uid,
          }))
      })
    } catch (error) {
      console.error('Error parsing data', error)
    }
  }

  return { parsedEdges, parsedNodes }
}
