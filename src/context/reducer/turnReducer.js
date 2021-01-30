const turnReducer = (state, action) => {
  switch (action.type) {
    case 'TURN OPENED':
      return { ...state, turn: Object.assign(state.turn, action.payload) }
    case 'TURN STORE':
      return { ...state, store: Object.assign(state.store, action.payload)}
  	case 'TURN INFO':	
      return { ...state, turnInfo: Object.assign(state.turnInfo, action.payload) }
    case 'TURN':
      return { ...state, turn: {}, store: {}, turnInfo: {} }
    default:
      throw new Error(`El action.type ${action.type} no existe en turnReducer`)
  }
}

export default turnReducer
