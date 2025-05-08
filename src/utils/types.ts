export interface Action {
  type: 'navigate' | 'rest' | 'openDrawer' | 'openModal'
  id: string
  name: string
  verb: 'GET' | 'POST' | 'DELETE'
  resourceRefId: string
  requireConfirmation?: boolean
  onSuccessNavigateTo?: string
  loading?: 'global' | 'inline' | 'none'
}
