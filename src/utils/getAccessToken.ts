import type { AuthResponseType } from '../pages/Login/Login.types'

const cachedAccessToken: string | null = null

export const getAccessToken = () => {
  if (cachedAccessToken) {
    return cachedAccessToken
  }

  const accessToken = localStorage.getItem('K_accessToken') as AuthResponseType['accessToken']

  if (!accessToken) {
    throw new Error('No access token found')
  }

  return accessToken
}

export const safeGetAccessToken = (): string | null => {
  try {
    return getAccessToken()
  } catch {
    return null
  }
}
