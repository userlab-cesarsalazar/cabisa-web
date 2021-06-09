const cancelSaleReducer = (state, action) => {
  switch (action.type) {
    case 'CANCEL_SALE START':
      return { ...state, status: 'LOADING', loading: 'cancelSale', error: null }
    case 'CANCEL_SALE END':
      return {
        ...state,
        cancelledSaleId: action.cancelledSaleId,
        status: 'SUCCESS',
        loading: 'cancelSale',
        error: null,
      }
    case 'CANCEL_SALE ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'cancelSale',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on cancelSaleReducer`
      )
  }
}

export default cancelSaleReducer
