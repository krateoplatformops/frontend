export type LoginFormType = {
  username: string
  password: string
}

export type FormType = 'basic' | 'ldap'

export type AuthResponseType = {
  accessToken: string
  user: {
    displayName: string
    username: string
    avatarURL: string
  } | null
  groups: string[]
  data: {
    apiVersion: string
    clusters: {
      cluster: {
        'certificate-authority-data': string
        server: string
      }
      name: string
    }[]
    contexts: {
      context: {
        cluster: string
        user: string
      }
      name: string
    }[]
    'current-context': string
    kind: string
    users: {
      user: {
        'client-certificate-data': string
        'client-key-data': string
      }
      name: string
    }[]
  } | null
}

export type AuthModeType = {
  extensions?: {
    authCodeURL: string
    redirectURL: string
  }
  name: string
  kind: string
  path: string
  graphics?: {
    icon: string
    displayName: string
    textColor: string
    backgroundColor: string
  }
}

export type AuthRequestType = {
  name: string
  code: string
  url: string
}
