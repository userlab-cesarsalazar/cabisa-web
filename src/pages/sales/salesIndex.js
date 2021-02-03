import React from 'react'
import HeaderPage from '../../components/HeaderPage'
import SalesTabIndex from './components/salesTabIndex'

function Sales() {
  return (
    <>
      <HeaderPage titleButton={''} title={'Ventas'} />
      <SalesTabIndex />
    </>
  )
}
export default Sales
