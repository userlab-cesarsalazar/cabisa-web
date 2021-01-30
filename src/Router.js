import React, { useState, useContext } from 'react'
import { withRouter } from 'react-router'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout, Divider } from 'antd'

import 'antd/dist/antd.css'
import './index.css'
import MenuView from './components/Menu'
import { menu_routes } from './components/Menu_routes'
import { Context, useStore } from './context'

//componentes
import Avatar from './components/Avatar'
import ResetPassword from './pages/login/ResetPassword'
import UISpinner from './components/UISpinner'
import CabisaLayout from './components/Layout'
import MenuUnfoldOutlined from '@ant-design/icons/lib/icons/MenuUnfoldOutlined'
import MenuFoldOutlined from '@ant-design/icons/lib/icons/MenuFoldOutlined'

const { Content, Sider } = Layout

function Router(props) {

    const [state, dispatch] = useContext(Context)
    const { hasPermissions } = useStore(state)
    const [collapsed, setCollapsed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showResetPassword, setShowResetPassword] = useState(false)

    const onCollapse = () => {
        setCollapsed(!collapsed)
    }

    const logout = async () => {
        console.log("logout")
        // setLoading(true)
        // await loginSrc
        //     .closeSession()
        //     .then(response => {
        //         src.sessionApp(null, 'remove')
        //         dispatch({ type: 'AUTH' })
        //         setLoading(false)
        //         message.success('Adios!')
        //     })
        //     .catch(err => {
        //         setLoading(false)
        //         message.error('Ocurrio un error al cerrar la sesion!')
        //     })
        //
        // history.go(0)
    }

    return (
        <div>
            <CabisaLayout>
                <Sider
                    trigger={null}
                    className="site-layout-background sider"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={onCollapse}
                    breakpoint="lg"
                    theme={'light'}
                >
                    <div className="logo center-flex-div" style={{ height: '55px', width: '100%' }}>
                        <div onClick={onCollapse} className={'fold-unfold-menu'}>
                            {' '}
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </div>
                        <img style={{ height: '80%' }} alt={'Cabisa'} src={collapsed ? 'cabisa-logo-small.png' : 'cabisa-logo.png'} />
                    </div>
                    <Divider className={'divider-custom-margins-nav'} type={'horizontal'} />
                    <Avatar
                        userName={"Luis de leon"}
                        collapsed={collapsed}
                        OnClose={logout}
                        OnResetPassword={() => {
                            setShowResetPassword(true)
                        }}
                    />
                    <Divider className={'divider-custom-margins-nav'} type={'horizontal'} />
                    <MenuView />
                </Sider>
                <Content>
                    <div style={{ padding: 24, marginTop: '-26px' }}>
                        {loading ? (
                            <UISpinner />
                        ) : (
                            <Switch>
                                {menu_routes.map((r, i) => (
                                        <Route exact key={i} path={r.route} component={r.component} />
                                ))}
                                <Redirect to='/users' />
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
