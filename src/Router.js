import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout, Divider } from 'antd'
import { Auth, Cache } from 'aws-amplify'
import 'antd/dist/antd.css'
import './index.css'
import MenuView from './components/Menu'
import { menu_sub_routes } from './components/Menu_routes'

//componentes
import Avatar from './components/Avatar'
import ResetPassword from './pages/login/ResetPassword'
import UISpinner from './components/UISpinner'
import CabisaLayout from './components/Layout'
import MenuUnfoldOutlined from '@ant-design/icons/lib/icons/MenuUnfoldOutlined'
import MenuFoldOutlined from '@ant-design/icons/lib/icons/MenuFoldOutlined'

const { Content, Sider } = Layout

function Router() {
  const [collapsed, setCollapsed] = useState(false)
  const [loading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [userDataInfo, setUserDataInfo] = useState(null)

  useEffect(() => {
    let userDataInfo = Cache.getItem('currentSession')
    setUserDataInfo(userDataInfo)
  }, [])

  const onCollapse = () => {
    setCollapsed(!collapsed)
  }

  const logout = async () => {
    Auth.signOut()
      .then(() => {
        Cache.clear()
        window.location.href = '/'
      })
      .catch(err => {
        console.log('error', err)
      })
  }

  const validateUrlPermission = () => {
    let permissions = Cache.getItem('currentSession').userPermissions.map(
      dat => dat.id
    )
    permissions.push(0)
    return menu_sub_routes
      .filter(flt => permissions.includes(flt.id))
      .map((r, i) => (
        <Route exact key={i} path={r.route} component={r.component} />
      ))
  }

  return (
    <div>
      <CabisaLayout>
        <Sider
          trigger={null}
          className='site-layout-background sider'
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          breakpoint='lg'
          theme={'light'}
        >
          <div
            className='logo center-flex-div'
            style={{ height: '55px', width: '100%' }}
          >
            <div onClick={onCollapse} className={'fold-unfold-menu'}>
              {' '}
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            <img
              style={{ height: '80%' }}
              alt={'Cabisa'}
              src={collapsed ? 'cabisa-logo-small.png' : 'cabisa-logo.png'}
            />
          </div>
          <Divider
            className={'divider-custom-margins-nav'}
            type={'horizontal'}
          />
          <Avatar
            userName={userDataInfo ? userDataInfo.userName : ''}
            collapsed={collapsed}
            OnClose={logout}
            OnResetPassword={() => {
              setShowResetPassword(true)
            }}
          />
          <Divider
            className={'divider-custom-margins-nav'}
            type={'horizontal'}
          />
          <MenuView />
        </Sider>
        <Content>
          <div style={{ padding: 24, marginTop: '-26px' }}>
            {loading ? (
              <UISpinner />
            ) : (
              <Switch>
                {validateUrlPermission()}
                <Redirect to='/welcome' />
              </Switch>
            )}
          </div>
        </Content>
      </CabisaLayout>
      <ResetPassword
        closable={() => {
          setShowResetPassword(false)
        }}
        visible={showResetPassword}
      />
    </div>
  )
}
export default withRouter(Router)
