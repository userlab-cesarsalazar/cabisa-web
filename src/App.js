import React, { useContext } from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import './index.css'
import { createBrowserHistory } from 'history'
import AppRouter from './Router'
import Login from './pages/login/Login'
import { Context } from './context'
const history = createBrowserHistory()

function App() {
  // const [{ users }] = useContext(Context)
  //
  // if (!users.id) {
  //   history.push('/')
  //   return <Login />
  // }

  return (
    <Router history={history}>
      <Switch>
        <Route render={props => <AppRouter {...props} />} />
      </Switch>
    </Router>
  )
}

export default App
