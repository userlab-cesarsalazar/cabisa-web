const fetchStakeholdersOptionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_STAKEHOLDERS_OPTIONS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchStakeholdersOptions',
        error: null,
      }
    case 'FETCH_STAKEHOLDERS_OPTIONS END':
      return {
        ...state,
        stakeholdersOptionsList: action.stakeholdersOptionsList,
        status: 'SUCCESS',
        loading: 'fetchStakeholdersOptions',
        error: null,
      }
    case 'FETCH_STAKEHOLDERS_OPTIONS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchStakeholdersOptions',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchStakeholdersOptionsReducer`
      )
  }
}

export default fetchStakeholdersOptionsReducer
