import { useEffect, useState } from "react"
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthModeType, AuthRequestType } from "../Login/Login.types";
import { Result, Space, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useConfigContext } from '../../context/ConfigContext'


const Auth = () => {
  const [searchParams] = useSearchParams();
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const kind = searchParams.get("kind");

  const { config } = useConfigContext()

  const {
    data: methods,
    error: isMethodsError,
    isSuccess: isMethodSuccess,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(`${config!.api.AUTHN_API_BASE_URL}/strategies`)
      return await res.json() as AuthModeType[]
    },
    queryKey: ['methods'],
  })
  
  const {
    mutateAsync: socialsAuthentication,
    isError: isSocialAuthError,
  } = useMutation({
    mutationFn: async (body: {
      name: string;
      code: string;
      url: string;
    }) => {
      const response = await fetch(`${config!.api.AUTHN_API_BASE_URL}${body.url}?name=${body.name}`, {
        method: 'GET',
        headers: {
          'X-Auth-Code': body.code,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Social auth failed');
      }

      return await response.json();
    },
  });

  useEffect(() => {
    const socialAuth = async (code: string, methodData: AuthModeType) => {
      const request: AuthRequestType = {
        name: methodData.name,
        code: code,
        url: methodData.path,
      }
      const userData = await socialsAuthentication(request)
      if (userData) {
        localStorage.setItem('K_user', JSON.stringify(userData))
        navigate('/')
      }
    }

    if (!isSocialAuthError && isMethodSuccess) {
      const methodData = methods?.find((el) => (el.kind === kind) && el.extensions?.redirectURL && (el.extensions.redirectURL.indexOf(window.location.protocol) > -1));
      
      if ( methodData?.extensions?.authCodeURL && (methodData.extensions.authCodeURL.indexOf("&state=") > -1) ) {
        if (state === localStorage.getItem("KrateoSL") && 
          code && 
          methodData
        ) {
          socialAuth(code, methodData);
        }
      } else if (code && methodData) {
        socialAuth(code, methodData);
      }
    } 
    if (isMethodsError || isSocialAuthError) {
      setShowError(true);
    }
  }, [code, methods, isSocialAuthError, isMethodsError, isMethodSuccess, navigate, socialsAuthentication, state])

  return (
    showError ?
    <Result
      status="warning"
      title="Authentication error"
      subTitle="There seems to be an authentication problem using this method"
      extra={<Link to="/login">Return to the Login page</Link>}
    />
    :
    <Space direction="vertical" size="large" style={{width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
      <Spin indicator={<LoadingOutlined />} size="large" />
      <Typography.Text>Authentication in progress...</Typography.Text>
    </Space>
  )
}

export default Auth;