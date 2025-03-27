import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* TODO: check if redux provider is needed */}
    {/* <Provider store={store}> */}
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: '#fbfbfb',
          colorBorder: '#E1E3E8',
          colorError: '#f84c4c',
          colorInfo: '#11B2E2',
          colorLink: '#05629A',
          colorPrimary: '#05629A',
          colorSuccess: '#00d690',
          colorSuccessBg: '#00D690',
          colorTextBase: '#323b40',
          colorWarning: '#ffaa00',
          // bar charts
          colorWhite: '#FFFFFF',

          fontFamily: 'Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
    {/* </Provider> */}
  </React.StrictMode>
)
