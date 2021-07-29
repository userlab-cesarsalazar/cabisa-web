const documentServiceTypesOptionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DOCUMENT_SERVICE_TYPE_OPTIONS START':
      return {
        ...state,
        status: 'LOADING',
        loading: 'fetchDocumentServiceType',
        error: null,
      }
    case 'FETCH_DOCUMENT_SERVICE_TYPE_OPTIONS END':
      return {
        ...state,
        documentServiceTypesOptionsList: action.documentServiceTypesOptionsList,
        status: 'SUCCESS',
        loading: 'fetchDocumentServiceType',
        error: null,
      }
    case 'FETCH_DOCUMENT_SERVICE_TYPE_OPTIONS ERROR':
      return {
        ...state,
        status: 'ERROR',
        loading: 'fetchDocumentServiceType',
        error: action.error,
      }
    default:
      throw new Error(
        `Unhandled action type: ${action.type} on documentServiceTypesOptionsReducer`
      )
  }
}

export default documentServiceTypesOptionsReducer
