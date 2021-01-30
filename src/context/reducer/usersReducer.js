import usersStore from '../state/usersStore'

const usersReducer = (state, action) => {
  switch (action.type) {
    case 'USERS FETCHED':
      return { ...state, users: Object.assign(state.users, action.payload) }
    case 'USERS':
      return usersStore
    default:
      throw new Error(`El action.type ${action.type} no existe en usersReducer`)
  }
}

export default usersReducer
