import React from 'react'
import reducer from './reducer'
import initialState from './state'
import saleActions from './actions'

const Context = React.createContext(initialState)

const SaleContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const store = React.useMemo(() => [state, dispatch], [state])

  return <Context.Provider value={store}>{children}</Context.Provider>
}

const useSale = () => {
  const context = React.useContext(Context)

  if (context === undefined) {
    throw new Error('useSale must be used within a SaleContextProvider')
  }
  return context
}

export { SaleContextProvider, useSale, saleActions }
