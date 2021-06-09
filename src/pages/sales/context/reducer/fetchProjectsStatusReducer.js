const fetchProjectsStatusReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS_STATUS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchProjectsStatus',
        error: null,
      }
    case 'FETCH_PROJECTS_STATUS END':
      return {
        ...state,
        salesStatusList: action.salesStatusList,
        status: 'SUCCESS',
        loading: 'fetchProjectsStatus',
        error: null,
      }
    case 'FETCH_PROJECTS_STATUS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchProjectsStatus',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchProjectsStatusReducer`
      )
  }
}

export default fetchProjectsStatusReducer
