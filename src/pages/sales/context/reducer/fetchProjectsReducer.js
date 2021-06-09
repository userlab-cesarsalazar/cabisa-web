const fetchProjectsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PROJECTS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchProjects',
        error: null,
      }
    case 'FETCH_PROJECTS END':
      return {
        ...state,
        projects: action.projects,
        status: 'SUCCESS',
        loading: 'fetchProjects',
        error: null,
      }
    case 'FETCH_PROJECTS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchProjects',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on fetchProjectsReducer`
      )
  }
}

export default fetchProjectsReducer
