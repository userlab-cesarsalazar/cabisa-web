/*
  |--------------------------------------------------------------------------
  | Reducers
  |--------------------------------------------------------------------------
  |
  | Son los responsables de mutar el state. Se puede tener un reducer por store
  | pero NO es necesario seguir la misma estructura que los stores.
  | Se debe respetar la siguiente convencion de nombres:
  | - reducer: camelCase mas el sufijo 'Reducer'
  | - action.type:
  | * Se usa como prefijo el nombre del reducer al que apuntan, sin el sufijo 'Reducer'
  | * Este prefjio se separa con un espacio del resto del nombre del accion.type
  | * Para el prefijo, los nombres de reducer con mas de una palabra se separan con "_" (undescore)
  |
*/
import approveSaleReducer from './approveSaleReducer'
import cancelSaleReducer from './cancelSaleReducer'
import createSaleReducer from './createSaleReducer'
import fetchChildProductsOptionsReducer from './fetchChildProductsOptionsReducer'
import fetchProductsOptionsReducer from './fetchProductsOptionsReducer'
import fetchProjectsOptionsReducer from './fetchProjectsOptionsReducer'
import fetchProjectsReducer from './fetchProjectsReducer'
import fetchProjectsStatusReducer from './fetchProjectsStatusReducer'
import fetchStakeholdersOptionsReducer from './fetchStakeholdersOptionsReducer'
import fetchDocumentServiceTypeOptionsReducer from './fetchDocumentServiceTypeOptionsReducer'
import fetchSalesReducer from './fetchSalesReducer'
import fetchSalesStatusReducer from './fetchSalesStatusReducer'
import setReducer from './setReducer'
import updateSaleReducer from './updateSaleReducer'
import fetchServiceOrdersReducer from './fetchServiceOrdersReducer'

const slices = {
  approveSaleReducer,
  cancelSaleReducer,
  createSaleReducer,
  fetchChildProductsOptionsReducer,
  fetchProductsOptionsReducer,
  fetchProjectsOptionsReducer,
  fetchProjectsReducer,
  fetchProjectsStatusReducer,
  fetchStakeholdersOptionsReducer,
  fetchDocumentServiceTypeOptionsReducer,
  fetchSalesReducer,
  fetchServiceOrdersReducer,
  fetchSalesStatusReducer,
  setReducer,
  updateSaleReducer,  
}

const resolveReducers = slices => (state, action) => {
  try {
    
    let reducerName = action.type.split(' ')[0]
    reducerName = reducerName
      .trim()
      .split('_')
      .map((word, index) => {
        if (index === 0) return word.toLowerCase()
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
    reducerName = `${reducerName.join('')}Reducer`
          
    return slices[reducerName](state, action)
  } catch (error) {
    throw new Error('The reducer must be included in "slices"')
  }
}

export default resolveReducers(slices)
