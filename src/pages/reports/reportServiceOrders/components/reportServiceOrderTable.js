import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  Table,
  Col,
  Input,  
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
import ActionOptions from '../../../../components/actionOptions'
import Tag from '../../../../components/Tag'
import { useSale, saleActions } from '../../../sales/context'
import { showErrors, formatPhone } from '../../../../utils'
import ReportsSrc from '../../reportsSrc'
const { Search } = Input
const { Option } = Select
const { setSaleState, fetchServiceOrders,fetchSalesStatus, cancelSale } = saleActions
const { RangePicker } = DatePicker

function ReportServiceOrderTable(props) {
  
    const [searchParams, setSearchParams] = useState({})    
    const [loadingSecondary, setLoadingSecondary] = useState(false)    
  const [{ error, status, loading, ...saleState }, saleDispatch] = useSale()

  useEffect(() => {
    if(props.exportExcel){                
        createFile()
    }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.exportExcel])

  useEffect(() => {
    if (props.isDrawerVisible) return

    if (status === 'ERROR') {
      showErrors(error)
      setSaleState(saleDispatch, { loading: null, error: null, status: 'IDLE' })
    }

    if (status === 'SUCCESS' && loading === 'cancelSale') {
      message.success('Venta cancelada exitosamente')
      fetchServiceOrders(saleDispatch)
    }

    if (status === 'SUCCESS' && loading === 'approveSale') {
      message.success('Factura generada exitosamente.')
      fetchServiceOrders(saleDispatch)
    }
  }, [error, status, loading, saleState, saleDispatch, props.isDrawerVisible])

  useEffect(() => {    
    fetchServiceOrders(saleDispatch)
    fetchSalesStatus(saleDispatch)
  }, [saleDispatch])

  const getSearchParams = (key, value) => {
    if (key === 'text') return { id: { $like: `%25${value}%25` } }
    
    if (key === 'cliente') return { name: { $like: `%25${value}%25` } }

    if (key === 'date') {            
        let values = value ? getDateRangeFilterReport(value) : {start_date:'',end_date:''}         
        return values
    }

    if (key === 'status') return { status: value }    
  }

  const getFilteredData = (key, value) => {
    const newSearchParams = { ...searchParams, ...getSearchParams(key, value) }    
    setSearchParams(newSearchParams)
    fetchServiceOrders(saleDispatch, newSearchParams)
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

  const columns = [
    {
      width:120,
      title: 'No. de boleta',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: text => <span>{text}</span>,
    },
    {
      width:120,
      title: 'Fecha',
      dataIndex: 'start_date', // Field that is goint to be rendered
      key: 'start_date',
      render: text => (
        <span>{text ? moment(text).format('DD-MM-YYYY') : null}</span>
      ),
    },
    {
      width:300,
      title: 'Cliente',
      dataIndex: 'stakeholder_name', // Field that is goint to be rendered
      key: 'stakeholder_name',
      render: text => <span>{text}</span>,
    },
    {
      width:300,
      title: 'Proyecto',
      dataIndex: 'project_name', // Field that is goint to be rendered
      key: 'project_name',
      render: text => <span>{text}</span>,
    },
    {
      width:100,
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='documentStatus' value={text} />,
    },   
    {
      width:200,
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (_, data) => (
        <ActionOptions
          showApproveBtn={false}
          showDeleteBtn={false}
          editPermissions={false}
          data={data}
          permissionId={props.permissions}
          handlerDeleteRow={handlerDeleteRow}
          handlerEditRow={handlerEditRow}
          handlerApproveRow={handlerApproveRow}
          deleteAction='nullify'
          editAction={!data.has_related_invoice ? 'edit' : 'show'}
        />
      ),
    },
  ]

  const getDateRangeFilterReport = dateRange => {
    if (!dateRange) return {}
  
    return {
      start_date: {
        $gte: moment(dateRange[0]).format('YYYY-MM-DD'),
      },
      end_date: {
        $lte: moment(dateRange[1]).add(1, 'days').format('YYYY-MM-DD'),
      },
    }
  }

  const createFile = async () => {
    let params = {...searchParams}            
    params.reportType = "serviceOrders" 
    setLoadingSecondary(true)
    let data = await ReportsSrc.exportReport(params)
    exportExcel(data.reportExcel)        
    props.endExcelCreation()
  }

  const exportExcel = (base64Excel) =>{
    try{      
      let uri = 'data:application/octet-stream;base64,'+base64Excel;
      let link = document.createElement('a');
      link.setAttribute("download", `Reporte-Notas-de-Servicio.xls`);
      link.setAttribute("href", uri);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(document.body.lastChild);                    
    }catch (e) {
      console.log('ERROR ON EXPORT MANIFEST',e)            
      message.warning('Error al exportar el manifiesto')
    }finally{
        setLoadingSecondary(false)
    }
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por No. de boleta'
            style={{ height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData('text', e)}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por Cliente'
            style={{ height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData('cliente', e)}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>        
          <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              format='DD-MM-YYYY'                          
              onChange={e => getFilteredData('date', e)}
            />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}
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
        
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 250 }}
                  loading={status === 'LOADING' || loadingSecondary}
                  className={'CustomTableClass'}
                  dataSource={saleState?.sales}
                  columns={columns}
                  pagination={{ pageSize: 5 }}
                  rowKey='id'
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Observaciones: </b>{' '}
                          {record.comments !== null
                            ? <AntTag color={'blue'}>{record.comments}</AntTag> 
                            : ''}{' '}
                        </p>
                        <p>
                          <b>Encargado: </b>{' '}
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
                          {record.stakeholder_phone
                            ? formatPhone(record.stakeholder_phone)
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

export default ReportServiceOrderTable
