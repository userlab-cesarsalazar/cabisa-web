const fetchProjectsOptionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS_OPTIONS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchProjectsOptions',
        error: null,
      }
    case 'FETCH_PROJECTS_OPTIONS END':
      return {
        ...state,
        projectsOptionsList: action.projectsOptionsList,
        status: 'SUCCESS',
        loading: 'fetchProjectsOptions',
        error: null,
      }
    case 'FETCH_PROJECTS_OPTIONS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchProjectsOptions',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchProjectsOptionsReducer`
      )
  }
}

export default fetchProjectsOptionsReducer
