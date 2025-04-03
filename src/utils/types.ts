export interface Action {
  name: string
  type: 'navigate' | 'custom'
  url?: string
}
