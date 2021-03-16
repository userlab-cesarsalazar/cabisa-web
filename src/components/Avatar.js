import React from 'react'
import { Divider, Popconfirm } from 'antd'

function Avatar(props) {
  return (
    <div
      className='logo center-flex-div user-options'
      style={{ height: '55px', width: '100%', cursor: 'pointer' }}
    >
      <img
        className={'menu-user-img'}
        src='usuario-white.png'
        alt={'Usuario'}
      />
      <span
        className={props.collapsed ? 'hide-component' : 'show-component'}
        style={{ marginLeft: '10px', color: 'white' }}
      >
        {props.userName}
      </span>
      <div
        className={
          props.collapsed
            ? `user-options-container user-options-container-collapse`
            : `user-options-container`
        }
      >
        <span className={'user-options-items'} onClick={props.OnResetPassword}>
          Cambiar contraseña
        </span>
        <Divider className={'divider-custom-margins'} type={'horizontal'} />
        <Popconfirm
          title='Estas seguro de cerrar la sesion?'
          onConfirm={props.OnClose}
          okText='Aceptar'
          cancelText='Cancelar'
        >
          <span className={'user-options-items'}>Cerrar Sesion</span>
        </Popconfirm>
      </div>
    </div>
  )
}

export default Avatar
