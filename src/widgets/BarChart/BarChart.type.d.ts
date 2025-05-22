export interface BarChart {
  version: string
  kind: string
  spec: {
    widgetData: {
      data: {
        label?: string
        bars: {
          value: string
          percentage: number
          color?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
        }[]
      }[]
    }
    apiRef?: {
      name: string
      namespace: string
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
  }
}
