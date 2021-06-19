import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  Table,
  Col,
  Input,
  Button,
  Row,
  Card,
  DatePicker,
  Select,
  Tag as AntTag,
  message,
} from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Cache } from 'aws-amplify'
import ActionOptions from '../../../../components/actionOptions'
import Tag from '../../../../components/Tag'
import { useSale, saleActions } from '../../context'
import { validatePermissions, showErrors } from '../../../../utils'

const { Search } = Input
const { Option } = Select
const { setSaleState, fetchSales, fetchSalesStatus, cancelSale } = saleActions

function SalesTable(props) {
  const [searchParams, setSearchParams] = useState({})
  const [{ error, status, loading, ...saleState }, saleDispatch] = useSale()

  useEffect(() => {
    if (props.isDrawerVisible) return

    if (status === 'ERROR') {
      showErrors(error)
      setSaleState(saleDispatch, { loading: null, error: null, status: 'IDLE' })
    }

    if (status === 'SUCCESS' && loading === 'cancelSale') {
      message.success('Venta cancelada exitosamente')
      fetchSales(saleDispatch)
    }

    if (status === 'SUCCESS' && loading === 'approveSale') {
      message.success('Factura generada exitosamente')
      fetchSales(saleDispatch)
    }
  }, [error, status, loading, saleState, saleDispatch, props.isDrawerVisible])

  useEffect(() => {
    fetchSales(saleDispatch)
    fetchSalesStatus(saleDispatch)
  }, [saleDispatch])

  const getSearchParams = (key, value) => {
    if (key === 'text') return { id: { $like: `%25${value}%25` } }

    if (key === 'date') {
      const start_date = value
        ? { $like: `%25${moment(value).format('YYYY-MM-DD')}%25` }
        : ''
      return { start_date }
    }

    if (key === 'status') return { status: value }
  }

  const getFilteredData = (key, value) => {
    const newSearchParams = { ...searchParams, ...getSearchParams(key, value) }
    setSearchParams(newSearchParams)

    fetchSales(saleDispatch, newSearchParams)
  }

  const handlerEditRow = async currentSale => {
    await setSaleState(saleDispatch, { currentSale })
    props.showDrawer(true)
  }

  const handlerApproveRow = row => {
    props.history.push({
      pathname: '/ServiceNoteBill',
      state: row,
    })
  }

  const handlerDeleteRow = row => {
    cancelSale(saleDispatch, { document_id: row.id })
  }

  const can = action =>
    validatePermissions(
      Cache.getItem('currentSession').userPermissions,
      props.permissions
    ).permissionsSection[0][action]

  const columns = [
    {
      title: 'No. de boleta',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'start_date', // Field that is goint to be rendered
      key: 'start_date',
      render: text => (
        <span>{text ? moment(text).format('DD-MM-YYYY') : null}</span>
      ),
    },
    {
      title: 'Empresa',
      dataIndex: 'stakeholder_name', // Field that is goint to be rendered
      key: 'stakeholder_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Proyecto',
      dataIndex: 'project_name', // Field that is goint to be rendered
      key: 'project_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='documentStatus' value={text} />,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (_, data) => (
        <ActionOptions
          showApproveBtn={!data.has_related_invoice}
          showDeleteBtn={!data.has_related_invoice}
          editPermissions={false}
          data={data}
          permissionId={props.permissions}
          handlerDeleteRow={handlerDeleteRow}
          handlerEditRow={handlerEditRow}
          handlerApproveRow={handlerApproveRow}
          deleteAction='cancel'
        />
      ),
    },
  ]

  return (
    <>
      <Row gutter={16}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por No. de boleta'
            style={{ height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData('text', e)}
          />
        </Col>
        <Col xs={5} sm={5} md={5} lg={5}>
          <DatePicker
            placeholder={'Buscar por fecha'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            format='DD-MM-YYYY'
            onChange={e => getFilteredData('date', e)}
          />
        </Col>
        <Col
          xs={5}
          sm={5}
          md={5}
          lg={5}
          className={props.warehouse ? 'stash-component' : ''}
        >
          <Select
            defaultValue={''}
            className={'single-select'}
            placeholder={'Status'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={value => getFilteredData('status', value)}
          >
            <Option value={''}>
              <AntTag color='cyan'>Todo</AntTag>
            </Option>
            {saleState.salesStatusList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='documentStatus' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className='text-right'>
          {/*{props.isAdmin && (*/}
          <Button
            className={
              can('create')
                ? 'title-cabisa new-button'
                : 'hide-component title-cabisa new-button'
            }
            onClick={props.newNote}
          >
            {props.buttonTitle}
          </Button>
          {/*)}*/}
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 250 }}
                  loading={status === 'LOADING'}
                  className={'CustomTableClass'}
                  dataSource={saleState?.sales}
                  columns={columns}
                  pagination={false}
                  rowKey='id'
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Encargado </b>{' '}
                          {record.stakeholder_business_man !== null
                            ? record.stakeholder_business_man
                            : ''}{' '}
                        </p>
                        <p>
                          <b>Direccion: </b>{' '}
                          {record.stakeholder_address !== null
                            ? record.stakeholder_address
                            : ''}{' '}
                        </p>
                        <p>
                          <b>Telefono: </b>{' '}
                          {record.stakeholder_phone !== null
                            ? record.stakeholder_phone
                            : ''}{' '}
                        </p>
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={e => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={e => onExpand(record, e)} />
                      ),
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SalesTable
