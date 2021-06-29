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
import { validatePermissions } from '../utils'
import { actions } from '../commons/types'

const { SubMenu } = Menu

function MenuView() {
  const history = useHistory()
  const [key, setKey] = useState('')

  useEffect(() => {
    let subMenuMatch = null
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
      if (subMenuMatch) {
        setKey(subMenuMatch.key)
      } else {
        setKey(history.location.pathname.split('View')[0].replace('/', ''))
      }
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
        return <HomeOutlined className={'ant-icon-menu-cabisa'} />
      case 'users':
        return <UsergroupAddOutlined className={'ant-icon-menu-cabisa'} />
      case 'shops':
        return <ShopOutlined className={'ant-icon-menu-cabisa'} />
      case 'products':
        return <ShoppingOutlined className={'ant-icon-menu-cabisa'} />
      case 'clients':
        return <IdcardOutlined className={'ant-icon-menu-cabisa'} />
      case 'configurations':
        return <SettingOutlined className={'ant-icon-menu-cabisa'} />
      case 'inventory':
        return <ProjectOutlined className={'ant-icon-menu-cabisa'} />
      case 'pos':
        return <CreditCardOutlined className={'ant-icon-menu-cabisa'} />
      case 'cashRegister':
        return <WalletOutlined className={'ant-icon-menu-cabisa'} />
      default:
        return <></>
    }
  }

  return (
    <Menu mode='inline' selectedKeys={[key]} className={'ant-menu-custom'}>
      {menu_routes &&
        menu_routes.length > 0 &&
        menu_routes.map(option =>
          option.sub_menu ? (
            <SubMenu
              className={
                validatePermissions(option.id)(actions.VIEW)
                  ? ''
                  : 'hide-component'
              }
              key={option.key}
              icon={returnIcon(option.icon)}
              title={option.name}
            >
              {option.sub_menu.map(subMenuOption => {
                return (
                  <Menu.Item
                    key={subMenuOption.key}
                    onClick={() => setKeyValue(subMenuOption.key)}
                  >
                    <Link to={subMenuOption.route}>
                      {returnIcon(option.icon)}
                      <span style={{ paddingLeft: '0px' }}>
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
                validatePermissions(option.id)(actions.VIEW)
                  ? ''
                  : 'hide-component'
              }
              key={option.key}
              icon={returnIcon()}
              onClick={() => setKey(option.key)}
            >
              <Link to={option.route}>
                {returnIcon(option.icon)}
                <span>{option.name}</span>
              </Link>
            </Menu.Item>
          )
        )}
    </Menu>
  )
}

export default MenuView
