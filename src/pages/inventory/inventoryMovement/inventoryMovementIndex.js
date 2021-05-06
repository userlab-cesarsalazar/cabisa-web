import React, { useEffect, useState } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryMovementComponent from './components/inventoryMovement'
import { movementData } from '../../../dummyData'

function InventoryMovementIndex() {
  const [inventoryMovements, setInventoryMovements] = useState([])

  useEffect(() => {
    getMovementsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMovementsData = () => {
    setTimeout(() => {
      setInventoryMovements(movementData)
    }, 500)
  }

  const searchByCategory = data => {
    console.log('SEARCH BY CATEGORY MOVEMENT', data)
  }

  const searchByText = data => {
    console.log('searchByText', data)
  }

  const deleteRow = data => {
    console.log('DELETE ', data)
    getMovementsData()
  }
  return (
    <>
      <HeaderPage
        titleButton={''}
        title={'Movimientos de inventario'}
        permissions={5}
      />
      <InventoryMovementComponent
        searchByTxt={searchByText}
        deleteMovement={deleteRow}
        dataSource={inventoryMovements}
        searchByCategoryMovement={searchByCategory}
        closeAfterSaveInventoryMovement={getMovementsData}
      />
    </>
  )
}

export default InventoryMovementIndex
