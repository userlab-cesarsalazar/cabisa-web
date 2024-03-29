import axios from 'axios'
import { Auth, Cache } from 'aws-amplify'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

const get = (url, params) => makeRequestApi(url, GET, params)
const post = (url, data) => makeRequestApi(url, POST, data)
const put = (url, data) => makeRequestApi(url, PUT, data)
const remove = (url, data) => makeRequestApi(url, DELETE, data)

const makeRequestApi = async (url, method, data) =>
  new Promise((resolve, reject) => {
    Auth.currentSession()
      .then(_ => {
        const params = method === GET ? getQueryParams(data) : ''
        const sessionToken = getSessionToken()

        return axios({
          url: url + params,
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          data: method !== GET && JSON.stringify(data),
        })
      })
      .then(data => {
        if (data.errors || data.data.errors || data.data.errorMessage)
          reject(data.data.errorMessage || data.data.errors || data.errors)

        resolve(data.data)
      })
      .catch(err => reject(err))
  })

const getQueryParams = (params, defaultParams = {}) => {
  const queryParams = { ...defaultParams, ...params }

  const result = Object.keys(queryParams).flatMap(k => {
    if (!queryParams[k]) return []

    let paramValue = queryParams[k]

    if (typeof queryParams[k] === 'object') {
      const paramOperators = Object.keys(queryParams[k]).map(operator => {
        if (operator !== '$or') paramValue = queryParams[k][operator]
        return operator
      })

      paramValue = `${paramOperators.join('')}:${paramValue}`
    }

    return `${k}=${paramValue}`
  })

  return `${result.length > 0 ? '?' : ''}${result.join('&')}`
}

const getSessionToken = () => {
  const currentSession = Cache.getItem('currentSession')

  if (!currentSession) return ''

  delete currentSession.token
  return window.btoa(JSON.stringify(currentSession))
}

const api = {
  get,
  post,
  put,
  remove,
}

export default api
