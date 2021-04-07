import axios from 'axios'
import { Auth } from 'aws-amplify'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

const makeRequestApi = async (url, method, data) =>
  new Promise((resolve, reject) => {
    Auth.currentSession()
      .then(_ =>
        axios({
          url: url,
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(data),
        })
      )
      .then(data => {
        if (data.errors) reject(data.errors[0].message)
        else resolve(data.data)
      })
      .catch(err => {
        if (err.response && err.response.data)
          return reject(err.response.data.message)

        console.log('Unknown error', err)

        reject({ message: 'Unknown error' })
      })
  })

const makeRequestApiParams = async (url, method, data) =>
    new Promise((resolve, reject) => {
        Auth.currentSession()
            .then(_ =>
                axios({
                    url: url,
                    method: method,
                    params: JSON.stringify(data),
                })
            )
            .then(data => {
                if (data.errors) reject(data.errors[0].message)
                else resolve(data.data)
            })
            .catch(err => {
                if (err.response && err.response.data)
                    return reject(err.response.data.message)

                console.log('Unknown error', err)

                reject({ message: 'Unknown error' })
            })
    })

const get = (url, data) => makeRequestApi(url, GET, data)
const getParams = (url, data) => makeRequestApiParams(url, GET, data)
const post = (url, data) => makeRequestApi(url, POST, data)
const put = (url, data) => makeRequestApi(url, PUT, data)
const remove = (url, data) => makeRequestApi(url, DELETE, data)

export default {
  makeRequestApi,
  makeRequestApiParams,
  get,
  post,
  put,
  remove,
  getParams
}
