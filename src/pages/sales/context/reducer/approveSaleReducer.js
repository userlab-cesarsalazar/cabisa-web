const approveSaleReducer = (state, action) => {
  switch (action.type) {
    case 'APPROVE_SALE START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'approveSale',
        error: null,
      }
    case 'APPROVE_SALE END':
      return {
        ...state,
        approvedSaleId: action.approvedSaleId,
        status: 'SUCCESS',
        loading: 'approveSale',
        error: null,
      }
    case 'APPROVE_SALE ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'approveSale',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on approveSaleReducer`
      )
  }
}

export default approveSaleReducer
