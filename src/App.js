import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import './index.css'
import { createBrowserHistory } from 'history'
import AppRouter from './Router'
import Login from './pages/login/Login'
import { Cache } from 'aws-amplify'
const history = createBrowserHistory()

function App() {

  if (!Cache.getItem('currentSession')) {
    return <Login />
  }


  return (
    <Router history={history}>
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </Router>
  )
}

export default App
