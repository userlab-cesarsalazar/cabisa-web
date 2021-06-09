const fetchProductsOptionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_OPTIONS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchProductsOptions',
        error: null,
      }
    case 'FETCH_PRODUCTS_OPTIONS END':
      return {
        ...state,
        productsOptionsList: action.productsOptionsList,
        status: 'SUCCESS',
        loading: 'fetchProductsOptions',
        error: null,
      }
    case 'FETCH_PRODUCTS_OPTIONS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchProductsOptions',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchProductsOptionsReducer`
      )
  }
}

export default fetchProductsOptionsReducer
