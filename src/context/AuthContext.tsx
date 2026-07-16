import { createContext, useContext, useState } from 'react'

import type { AuthResponseType } from '../pages/Login/Login.types'

import { useConfigContext } from './ConfigContext'

type AuthContextType = {
  accessToken: AuthResponseType['accessToken'] | null
  groups: AuthResponseType['groups'] | null
  user: AuthResponseType['user'] | null
  login: (data: AuthResponseType) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const readStoredJSON = <T, >(key: string): T | null => {
  const raw = localStorage.getItem(key)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) { throw new Error('AuthContext missing') }
  return ctx
}

export const AuthProvider = ({ children }) => {
  const { refetch } = useConfigContext()

  const [accessToken, setAccessToken] = useState(() => {
    const stored = localStorage.getItem('K_accessToken')
    return stored ?? null
  })

  const [groups, setGroups] = useState(() => readStoredJSON<AuthResponseType['groups']>('K_groups'))

  const [user, setUser] = useState(() => readStoredJSON<AuthResponseType['user']>('K_user'))

  const login = (data: AuthResponseType) => {
    const user = data.user ?? null
    const groups = data.groups ?? []

    localStorage.setItem('K_accessToken', data.accessToken)
    localStorage.setItem('K_user', JSON.stringify(user))
    localStorage.setItem('K_groups', JSON.stringify(groups))

    setAccessToken(data.accessToken)
    setGroups(groups)
    setUser(user)
  }

  const logout = async () => {
    try {
      // Pulizia context + localStorage
      setAccessToken(null)
      setGroups(null)
      setUser(null)
      localStorage.clear()

      // Pulizia session storage
      sessionStorage.clear()

      // Pulizia cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })

      // Pulizia cache
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }

      // Pulizia indexedDB
      if (window.indexedDB && indexedDB.databases) {
        const dbs = await indexedDB.databases()
        dbs.forEach(db => {
          if (db.name) { indexedDB.deleteDatabase(db.name) }
        })
      }

      // Refetch config.json
      await refetch()
    } catch (error) {
      console.error('Logout cleanup error', error)
    }
  }

  return (
    <AuthContext.Provider value={{ accessToken, groups, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}
