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

  const [groups, setGroups] = useState(() => {
    const stored = localStorage.getItem('K_groups')
    return stored ? JSON.parse(stored) as AuthResponseType['groups'] : null
  })

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('K_user')
    return stored ? JSON.parse(stored) as AuthResponseType['user'] : null
  })

  const login = (data: AuthResponseType) => {
    localStorage.setItem('K_accessToken', data.accessToken)
    localStorage.setItem('K_user', JSON.stringify(data.user))
    localStorage.setItem('K_groups', JSON.stringify(data.groups))

    setAccessToken(data.accessToken)
    setGroups(data.groups)
    setUser(data.user)
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
