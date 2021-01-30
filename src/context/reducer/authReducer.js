import authStore from '../state/authStore'

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH FETCHED':
      return { ...state, auth: Object.assign(state.auth, action.payload) }
    case 'AUTH':
      return authStore
    default:
      throw new Error(`El action.type ${action.type} no existe en authReducer`)
  }
}

export default authReducer
