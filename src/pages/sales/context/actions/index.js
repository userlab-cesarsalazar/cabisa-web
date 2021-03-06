import salesSrc from '../../salesSrc'

const saleActions = {
  fetchProductsOptions: async (dispatch, params = {}) => {
    dispatch({ type: 'FETCH_PRODUCTS_OPTIONS START' })
    try {
      const productsOptionsList = await salesSrc.getProductsOptions({
        ...params,
      })
      dispatch({ type: 'FETCH_PRODUCTS_OPTIONS END', productsOptionsList })
    } catch (error) {
      dispatch({ type: 'FETCH_PRODUCTS_OPTIONS ERROR', error })
    }
  },

  fetchProjectsOptions: async (dispatch, params = {}) => {
    dispatch({ type: 'FETCH_PROJECTS_OPTIONS START' })
    try {
      const projectsOptionsList = await salesSrc.getProjectsOptions({
        ...params,
      })
      dispatch({ type: 'FETCH_PROJECTS_OPTIONS END', projectsOptionsList })
    } catch (error) {
      dispatch({ type: 'FETCH_PROJECTS_OPTIONS ERROR', error })
    }
  },

  fetchStakeholdersOptions: async (dispatch, params = {}) => {
    dispatch({ type: 'FETCH_STAKEHOLDERS_OPTIONS START' })
    try {
      const stakeholdersOptionsList = await salesSrc.getStakeholdersOptions({
        ...params,
      })
      dispatch({
        type: 'FETCH_STAKEHOLDERS_OPTIONS END',
        stakeholdersOptionsList,
      })
    } catch (error) {
      dispatch({ type: 'FETCH_STAKEHOLDERS_OPTIONS ERROR', error })
    }
  },

  fetchSales: async (dispatch, params = {}) => {
    dispatch({ type: 'FETCH_SALES START' })
    try {
      const sales = await salesSrc.getSales({ ...params })
      dispatch({ type: 'FETCH_SALES END', sales })
    } catch (error) {
      dispatch({ type: 'FETCH_SALES ERROR', error })
    }
  },

  fetchSalesStatus: async dispatch => {
    dispatch({ type: 'FETCH_SALES_STATUS START' })
    try {
      const salesStatusList = await salesSrc.getSalesStatus()
      dispatch({ type: 'FETCH_SALES_STATUS END', salesStatusList })
    } catch (error) {
      dispatch({ type: 'FETCH_SALES_STATUS ERROR', error })
    }
  },

  approveSale: async (dispatch, data) => {
    dispatch({ type: 'APPROVE_SALE START' })
    try {
      const approvedSaleId = await salesSrc.approveSale(data)
      dispatch({ type: 'APPROVE_SALE END', approvedSaleId })
    } catch (error) {
      dispatch({ type: 'APPROVE_SALE ERROR', error })
    }
  },

  cancelSale: async (dispatch, data) => {
    dispatch({ type: 'CANCEL_SALE START' })
    try {
      const cancelledSaleId = await salesSrc.cancelSale(data)
      dispatch({ type: 'CANCEL_SALE END', cancelledSaleId })
    } catch (error) {
      dispatch({ type: 'CANCEL_SALE ERROR', error })
    }
  },

  createSale: async (dispatch, data) => {
    dispatch({ type: 'CREATE_SALE START' })
    try {
      const createdSaleId = await salesSrc.createSale(data)
      dispatch({ type: 'CREATE_SALE END', createdSaleId })
    } catch (error) {
      dispatch({ type: 'CREATE_SALE ERROR', error })
    }
  },

  updateSale: async (dispatch, data) => {
    dispatch({ type: 'UPDATE_SALE START' })
    try {
      const updatedSaleId = await salesSrc.updateSale(data)
      dispatch({ type: 'UPDATE_SALE END', updatedSaleId })
    } catch (error) {
      dispatch({ type: 'UPDATE_SALE ERROR', error })
    }
  },

  setSaleState: async (dispatch, data) => dispatch({ type: 'SET', data }),
}

export default saleActions
