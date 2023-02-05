const fetchserviceOrdersReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_SERVICE_ORDERS START':        
        return { ...state, status: 'LOADING', loading: 'fetchServiceOrders', error: null }
      case 'FETCH_SERVICE_ORDERS END':
        return {
          ...state,
          sales: action.sales,
          status: 'SUCCESS',
          loading: 'fetchServiceOrders',
          error: null,
        }
      case 'FETCH_SERVICE_ORDERS ERROR':
        return {
          ...state,
          status: 'ERROR',
          loading: 'fetchServiceOrders',
          error: action.error,
        }
      default:
        throw new Error(
          `Unhandled action type: ${action.type} on fetchServiceOrdersReducer`
        )
    }
  }
  
  export default fetchserviceOrdersReducer
  