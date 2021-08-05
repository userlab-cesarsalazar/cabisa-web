const fetchChildProductsOptionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CHILD_PRODUCTS_OPTIONS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchChildProductsOptions',
        error: null,
      }
    case 'FETCH_CHILD_PRODUCTS_OPTIONS END':
      return {
        ...state,
        childProductsOptionsList: action.childProductsOptionsList,
        status: 'SUCCESS',
        loading: 'fetchChildProductsOptions',
        error: null,
      }
    case 'FETCH_CHILD_PRODUCTS_OPTIONS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchChildProductsOptions',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchChildProductsOptionsReducer`
      )
  }
}

export default fetchChildProductsOptionsReducer
