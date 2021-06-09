const updateSaleReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SALE START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'updateSale',
        error: null,
      }
    case 'UPDATE_SALE END':
      return {
        ...state,
        updatedSaleId: action.updatedSaleId,
        status: 'SUCCESS',
        loading: 'updateSale',
        error: null,
      }
    case 'UPDATE_SALE ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'updateSale',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on updateSaleReducer`
      )
  }
}

export default updateSaleReducer
