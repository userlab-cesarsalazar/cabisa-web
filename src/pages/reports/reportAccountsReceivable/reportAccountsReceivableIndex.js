import React, { useState } from 'react'
import GenericTable from '../../../components/genericTable'
import { Button, Divider, Popconfirm, Popover, Tag } from 'antd'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import ReportAccountsReceivableFilters from './components/reportAccountsReceivableFilters'
import HeaderPage from '../../../components/HeaderPage'

function ReportAccountsReceivable() {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])

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
      id: 3,
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
        <span>
          {
            <Popover
              placement='left'
              style={{ zIndex: 'auto' }}
              content={
                <div>
                  <span className={'user-options-items'}>Editar</span>
                  <Divider
                    className={'divider-enterprise-margins'}
                    type={'horizontal'}
                  />
                  <Popconfirm
                    title='Estas seguro de borrar el elemento selccionado?'
                    okText='Si'
                    cancelText='No'
                  >
                    <span className={'user-options-items'}>Eliminar</span>
                  </Popconfirm>
                </div>
              }
              trigger='click'
            >
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            </Popover>
          }
        </span>
      ),
    },
  ]

  return (
    <>
      <HeaderPage title={'Reporte - Cuentas por cobrar'} />
      <ReportAccountsReceivableFilters />
      <GenericTable data={data} loading={loading} columns={columns} />
    </>
  )
}

export default ReportAccountsReceivable
