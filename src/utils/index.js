import { message } from 'antd'
import { Cache } from 'aws-amplify'

export const roundNumber = (input, decimals = 2) => {
  const number = Number(input)

  if (!input || isNaN(number)) return input

  return Number(number.toFixed(decimals))
}

export const formatNumber = number => {
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

export const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const validateRole = rolId => {
  const currentSessionRoleId = Cache.getItem('currentSession').rol_id
  return currentSessionRoleId <= rolId
}

export const validatePermissions = permissionId => {
  const currentSessionPermissions = Cache.getItem('currentSession')
    .userPermissions
  const currentPermission = currentSessionPermissions.find(
    p => Number(p.id) === Number(permissionId)
  )

  return action => currentPermission && currentPermission[action]
}

export const validateDynamicTableProducts = (
  products,
  productsRequiredFields
) => {
  return products.reduce(
    (result, p, i) => {
      const newPosition = [...(result.duplicate[p.product_id] || []), i + 1]
      const newResult = {
        ...result,
        duplicate: p.product_id
          ? {
              ...result.duplicate,
              [p.product_id]: newPosition,
            }
          : result.duplicate,
      }

      const hasRequiredError = productsRequiredFields.some(
        k => !p[k] || p[k] < 0
      )

      if (hasRequiredError) {
        return {
          ...newResult,
          required: [...newResult.required, i + 1],
        }
      }

      return newResult
    },
    { required: [], duplicate: {} }
  )
}

const getErrorData = error => {
  if (error?.response?.data?.error?.errors)
    return error.response.data.error.errors

  if (error?.response?.data?.error) return error.response.data.error

  if (error.message) return error.message

  if (error && !error.response) return 'Network Error'

  return 'Unknown Error'
}

export const getPercent = number => {
  const tax_fee = Number(number)
  return !isNaN(tax_fee) && tax_fee > 0 ? tax_fee / 100 : 0
}

export const showErrors = error => {
  const data = getErrorData(error)
  const messages = typeof data === 'string' ? [data] : data

  messages.forEach(msg => message.error(msg))
}

export const catchingErrors = errorCode => {
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
    case errorCode.indexOf('Attempt limit exceeded') > -1:
      return 'Se ha excedido el numero de intentos, espera un momento y vuelve a intentarlo.'
    default:
      return 'Error al procesar la información.'
  }
}

export const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export const isEmptyObject = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }

  return JSON.stringify(obj) === JSON.stringify({})
}
