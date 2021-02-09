import React, { useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import BillingTable from './components/BillingTable'
import LoadMoreButton from '../../components/LoadMoreButton'
import DetailBilling from './components/detailBilling'

const dataDummy = [
  {
    id: 1,
    serie: 'A-12312',
    service_type: 'Maquinaria',
    client: { name: 'Luis de Leon', nit: '234234-9' },
    date_created: '8/02/2021 15:35',
    total_bill: '5000.00',
    payment_method: 'Tarjeta debito/credito',
  },
  {
    id: 2,
    serie: 'A-12312',
    service_type: 'Maquinaria',
    client: { name: 'Otto rocket', nit: '1231-0' },
    date_created: '8/02/2021 15:35',
    total_bill: '45000.00',
    payment_method: 'Transferencia',
  },
  {
    id: 3,
    serie: 'A-12312',
    service_type: 'Servicio',
    client: { name: 'Userlab S.A.', nit: '1231-0' },
    date_created: '8/02/2021 15:35',
    total_bill: '13000.00',
    payment_method: 'Efectivo',
  },
  {
    id: 4,
    serie: 'A-12312',
    service_type: 'Equipo',
    client: { name: 'Userlab S.A.', nit: '1231-0' },
    date_created: '8/02/2021 15:35',
    total_bill: '13000.00',
    payment_method: 'Efectivo',
  },
  {
    id: 5,
    serie: 'A-12312',
    service_type: 'Equipo',
    client: { name: 'Userlab2 S.A.', nit: '1231-0' },
    date_created: '01/02/2021 15:35',
    total_bill: '3000.00',
    payment_method: 'Transferencia',
  },
]

function Billing(props) {
  const [visible, setVisible] = useState(false)

  const newBill = () => {
    props.history.push('/billingView')
  }

  const showDetail = data => {
    console.log(data)
    setVisible(true)
  }

  const closeDetail = () => {
    setVisible(false)
  }

  return (
    <>
      <HeaderPage
        titleButton={'Factura Nueva'}
        title={'Facturación'}
        showDrawer={newBill}
        permissions={6}
      />
      <BillingTable dataSource={dataDummy} showDetail={showDetail} />
      <LoadMoreButton
        handlerButton={() => console.log('more Button')}
        moreInfo={false}
      />
      <DetailBilling
        closable={closeDetail}
        visible={visible}
        edit={true}
        editData={[]}
        cancelButton={closeDetail}
      />
    </>
  )
}
export default Billing
