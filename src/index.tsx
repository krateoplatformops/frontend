import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import VARIABLES from './theme/palette.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: {
      colorBgBase: VARIABLES.panelbg,
      colorBorder: VARIABLES.border,
      colorError: VARIABLES.error,
      colorInfo: VARIABLES.info,
      colorLink: VARIABLES.primary,
      colorPrimary: VARIABLES.primary,
      colorSuccess: VARIABLES.success,
      colorSuccessBg: VARIABLES.success,
      colorTextBase: VARIABLES.text,
      colorWarning: VARIABLES.warning,
      colorWhite: VARIABLES.light,
      fontFamily: 'Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif',
    } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
