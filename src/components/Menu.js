import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import {
  HomeOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  ShoppingOutlined,
  IdcardOutlined,
  SettingOutlined,
  ProjectOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { menu_routes } from './Menu_routes'

function MenuView() {
  const history = useHistory()
  const [key, setKey] = useState('')

  useEffect(() => {
    let actualPath = menu_routes.find(
      m =>
        menuRouterFunction(m.routeGroup, m.route) === history.location.pathname
    )
    setKey(actualPath.key)
  }, [])

  const menuRouterFunction = (regexpArray, defaultRoute) => {
    let someOneMatch = false
    regexpArray.forEach(regexp => {
      if (regexp.test(history.location.pathname)) {
        someOneMatch = true
      }
    })
    return someOneMatch ? history.location.pathname : defaultRoute
  }

  let returnIcon = iconName => {
    switch (iconName) {
      case 'enterprises':
        return (
          <HomeOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'users':
        return (
          <UsergroupAddOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'shops':
        return (
          <ShopOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'products':
        return (
          <ShoppingOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'clients':
        return (
          <IdcardOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'configurations':
        return (
          <SettingOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'inventory':
        return (
          <ProjectOutlined
            style={{
              color: 'var(--cabisa-yellow)',
              fontSize: '18px',
              transform: 'rotate(-90deg)',
            }}
          />
        )
      case 'pos':
        return (
          <CreditCardOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      case 'cashRegister':
        return (
          <WalletOutlined
            style={{ color: 'var(--cabisa-yellow)', fontSize: '18px' }}
          />
        )
      default:
        return <React.Fragment></React.Fragment>
    }
  }

  return (
    <Menu
      mode='inline'
      selectedKeys={[key]}
      style={{ height: '100%', paddingTop: '20px', border: 'none' }}
    >
      {menu_routes &&
        menu_routes.length > 0 &&
        menu_routes.map((option, i) => (
          <Menu.Item
            key={option.key}
            icon={returnIcon()}
            onClick={() => setKey(option.key)}
          >
            <Link to={option.route}>
              {returnIcon(option.icon)}
              <span style={{ paddingLeft: '13px' }}>{option.name}</span>
            </Link>
          </Menu.Item>
        ))}
    </Menu>
  )
}
export default MenuView
