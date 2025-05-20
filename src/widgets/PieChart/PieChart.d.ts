export interface PieChart {
  version: string
  kind: string
  spec: {
    widgetData: {
      title: string
      description?: string
      series?: {
        total: number
        data: {
          color: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
          value: number
          label: string
        }[]
      }
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
