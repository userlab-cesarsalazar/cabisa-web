const createSaleReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_SALE START':
      return { ...state, status: 'LOADING', loading: 'createSale', error: null }
    case 'CREATE_SALE END':
      return {
        ...state,
        createdSaleId: action.createdSaleId,
        status: 'SUCCESS',
        loading: 'createSale',
        error: null,
      }
    case 'CREATE_SALE ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'createSale',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on createSaleReducer`
      )
  }
}

export default createSaleReducer
