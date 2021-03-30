import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ContextProvider } from './context'
import { ConfigProvider } from 'antd'
import es_ES from 'antd/es/locale/es_ES'
// import * as serviceWorker from './serviceWorker'
ReactDOM.render(
  <ConfigProvider locale={es_ES}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ConfigProvider>,
  document.getElementById('root')
)
// serviceWorker.register();
