const setReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, ...action.data }
    default:
      throw new Error(`Unhandled action type: ${action.type} on setReducer`)
  }
}

export default setReducer
