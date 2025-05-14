import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../../context/ConfigContext'

import LoginForm from './LoginForm'
import type { AuthModeType, FormType, LoginFormType } from './types'

const Login = () => {
  const navigate = useNavigate()
  const { config } = useConfigContext()
  const authUrl = `${config!.api.AUTHN_API_BASE_URL}/strategies`

  const {
    data,
    // error,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(authUrl)
      const data = await res.json() as AuthModeType[]

      return data
    },
    queryKey: ['credentials', authUrl],
  })

  const {
    isPending: isLoginLoading,
    mutateAsync: login,
    // error,
  } = useMutation({
    mutationFn: async (credentials: { username: string; password: string; path: string }) => {
      const authUrl = `${config!.api.AUTHN_API_BASE_URL}${credentials.path}`

      const res = await fetch(authUrl, {
        headers: {
          Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
        },
        method: 'GET',
      })

      const data = await res.json() as AuthModeType[]

      return data
    },
  })

  if (!data) {
    return <></>
  }

  const onFormSubmit = async (body: LoginFormType, type: FormType) => {
    const dataMode = data?.find((el) => el.kind === type)

    if (body.username && body.password && dataMode?.path) {
      const loginData = await login({ password: body.password, path: dataMode.path, username: body.username })
      console.log('loginData', loginData)
    }

    void navigate('/')
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <LoginForm isLoading={isLoginLoading} method={data?.[0]} onSubmit={(values) => onFormSubmit(values, data[0].kind as FormType)} />
}

export default Login
