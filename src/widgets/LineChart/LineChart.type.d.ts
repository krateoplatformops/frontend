export interface LineChart {
  version: string
  kind: string
  spec: {
    widgetData: {
      lines: {
        name?: string
        color?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
        coords?: {
          xAxis: number
          yAxis: number
        }[]
      }[]
      xAxisName?: string
      yAxisName?: string
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
