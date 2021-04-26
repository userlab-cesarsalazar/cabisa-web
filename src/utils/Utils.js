module.exports.formatNumber = number => {
  if (number === 0) return number
  let num1 = number?.split('.')[0]
  let num2 = number?.split('.')[1]?.slice(0, 2) || '00'
  num1 = num1
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(?=\d*\.?)(\d{3})/g, '$1,')
  num1 = num1.split('').reverse().join('').replace(/^[.]/, '')
  let num = `${num1}.${num2}`
  return num
}

module.exports.validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

module.exports.validatePermissions = (dataPermissions, id) => {
  let permissionsData = {}
  let sectionEnable = [id].every(perm =>
    dataPermissions.some(v => v.id === perm)
  )
  let dataSection = dataPermissions.filter(dataFilter => dataFilter.id === id)

  if (sectionEnable) {
    permissionsData.enableSection = dataSection[0].view
    permissionsData.permissionsSection = dataSection
  } else {
    permissionsData.enableSection = sectionEnable
    permissionsData.permissionsSection = dataSection
  }
  return permissionsData
}

module.exports.catchingErrors = errorCode => {
  switch (true) {
    case errorCode.indexOf('UsernameExistsException') > -1:
      return 'El nombre de usuario ya existe.'
    case errorCode.indexOf('InvalidPasswordException') > -1:
      return 'La contraseña debe tener letras minusculas,mayusculas y un caracter especial.'
    case errorCode.indexOf('The provided email is already registered') > -1:
      return 'El correo electrónico proporcionado ya está registrado.'
    case errorCode.indexOf('User is disabled.') > -1:
      return 'Usuario deshabilitado, contacta al administrador.'
    case errorCode.indexOf('UserMigration failed') > -1:
      return 'Usuario/Password incorrectos.'
    case errorCode.indexOf('Incorrect') > -1:
      return 'Usuario/Password incorrectos'
    case errorCode.indexOf('User does not exist.') > -1:
      return 'El usuario aun no esta confirmado.'
    case errorCode.indexOf('is not registered') > -1:
      return 'El Cliente no esta registrado'
    default:
      return 'Error al procesar la información.'
  }
}
