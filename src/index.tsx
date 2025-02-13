import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import { store } from './redux/store.ts'
import './theme/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>
)
