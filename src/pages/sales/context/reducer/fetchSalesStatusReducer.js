const fetchSalesStatusReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SALES_STATUS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchSalesStatus',
        error: null,
      }
    case 'FETCH_SALES_STATUS END':
      return {
        ...state,
        salesStatusList: action.salesStatusList,
        status: 'SUCCESS',
        loading: 'fetchSalesStatus',
        error: null,
      }
    case 'FETCH_SALES_STATUS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchSalesStatus',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchSalesStatusReducer`
      )
  }
}

export default fetchSalesStatusReducer
