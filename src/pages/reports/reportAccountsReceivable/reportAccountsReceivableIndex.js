import React, { useEffect, useState } from 'react'
import GenericTable from '../../../components/genericTable'
import { Tag } from 'antd'
import ReportAccountsReceivableFilters from './components/reportAccountsReceivableFilters'
import HeaderPage from '../../../components/HeaderPage'
import ActionOptions from '../../../components/actionOptions'

function ReportAccountsReceivable() {
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState([])

  const handlerDeleteRow = data => {
    console.log(data)
  }

  const handlerEditRow = data => {
    console.log(data)
  }

  const data = [
    {
      id: 1,
      client_name: 'Luis de leon',
      client_type: 1,
      amount: '5000.00',
      bill_date: '11/02/2021',
      payment_date: '10/12/2021',
      payment_made_date: '10/12/2021',
      situation: 1,
      observation: 'Cliente nuevo etc.... 1234567890',
    },
    {
      id: 2,
      client_name: 'Luis de leon',
      client_type: 2,
      amount: '5000.00',
      bill_date: '11/02/2021',
      payment_date: '10/12/2021',
      payment_made_date: '10/12/2021',
      situation: 1,
      observation: 'Cliente nuevo etc.... 1234567890',
    },
    {
      id: 3,
      client_name: 'Luis de leon',
      client_type: 3,
      amount: '5000.00',
      bill_date: '11/02/2021',
      payment_date: '10/12/2021',
      payment_made_date: '10/12/2021',
      situation: 1,
      observation: 'Cliente nuevo etc.... 1234567890',
    },
  ]

  const columns = [
    {
      title: 'Cliente',

      dataIndex: 'client_name', // Field that is goint to be rendered
      key: 'client_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Monto',
      dataIndex: 'amount', // Field that is goint to be rendered
      key: 'amount',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha de facturacion',
      dataIndex: 'bill_date', // Field that is goint to be rendered
      key: 'bill_date',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha a pagar',
      dataIndex: 'payment_date', // Field that is goint to be rendered
      key: 'payment_date',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha pago realizado',
      dataIndex: 'payment_made_date', // Field that is goint to be rendered
      key: 'payment_made_date',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Situacion',
      dataIndex: 'situation', // Field that is goint to be rendered
      key: 'situation',
      render: text => (
        <span>
          {text === 1 ? (
            <Tag color='#87d068'>PAGADO</Tag>
          ) : text === 2 ? (
            <Tag color='#f50'>SIN PAGAR</Tag>
          ) : text === 3 ? (
            <Tag color='#f50'>PAGO ATRASADO</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'Observacion',
      dataIndex: 'observation', // Field that is goint to be rendered
      key: 'observation',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <ActionOptions
          editPermissions={false}
          data={data}
          permissionId={3}
          handlerDeleteRow={handlerDeleteRow}
          handlerEditRow={handlerEditRow}
        />
      ),
    },
  ]

  const filterData = data => {
    console.log('DATA FILTERS', data)
  }

  useEffect(() => {
    setDataSource(data)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeaderPage title={'Reporte - Cuentas por cobrar'} />
      <ReportAccountsReceivableFilters filterData={filterData} />
      <GenericTable data={dataSource} loading={loading} columns={columns} />
    </>
  )
}

export default ReportAccountsReceivable
