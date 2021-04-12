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
import { Cache } from 'aws-amplify'
import { validatePermissions } from '../utils/Utils'
const { SubMenu } = Menu

function MenuView() {
  const history = useHistory()
  const [key, setKey] = useState('')
  let subMenuMatch

  useEffect(() => {
    let actualPath = menu_routes.find(
      m =>
        menuRouterFunction(m.routeGroup, m.route) === history.location.pathname
    )

    if (actualPath.sub_menu) {
      actualPath.routeGroup.forEach(regexp => {
        if (regexp.test(history.location.pathname)) {
          subMenuMatch = actualPath.sub_menu.find(
            m => m.route === history.location.pathname
          )
        }
      })
      setKey(subMenuMatch.key)
    } else {
      setKey(actualPath.key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setKeyValue = key => {
    setKey(key)
  }
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
      mode='vertical'
      selectedKeys={[key]}
      style={{ height: '100%', paddingTop: '20px', border: 'none' }}
    >
      {menu_routes &&
        menu_routes.length > 0 &&
        menu_routes.map(
          (option, i) =>
            option.sub_menu ? (
              <SubMenu
                className={
                  validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    option.id
                  ).enableSection
                    ? ''
                    : 'hide-component'
                }
                key={option.key}
                icon={returnIcon(option.icon)}
                title={option.name}
              >
                {option.sub_menu.map((subMenuOption, index) => {
                  return (
                    <Menu.Item
                      key={subMenuOption.key}
                      onClick={() => setKeyValue(subMenuOption.key)}
                    >
                      <Link to={subMenuOption.route}>
                        {returnIcon(option.icon)}
                        <span style={{ paddingLeft: '13px' }}>
                          {subMenuOption.name}
                        </span>
                      </Link>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            ) : (
              <Menu.Item
                className={
                  validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    option.id
                  ).enableSection
                    ? ''
                    : 'hide-component'
                }
                key={option.key}
                icon={returnIcon()}
                onClick={() => setKey(option.key)}
              >
                <Link to={option.route}>
                  {returnIcon(option.icon)}
                  <span style={{ paddingLeft: '13px' }}>{option.name}</span>
                </Link>
              </Menu.Item>
            )

          // <Menu.Item
          //   key={option.key}
          //   icon={returnIcon()}
          //   onClick={() => setKey(option.key)}
          // >
          //   <Link to={option.route}>
          //     {returnIcon(option.icon)}
          //     <span style={{ paddingLeft: '13px' }}>{option.name}</span>
          //   </Link>
          // </Menu.Item>
        )}
    </Menu>
  )
}
export default MenuView
