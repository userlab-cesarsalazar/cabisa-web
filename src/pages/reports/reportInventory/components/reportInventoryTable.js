import React, { useEffect, useState, useRef } from 'react'
import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Tag as AntTag,
  Spin,
  Statistic,
  Divider,message
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import ActionOptions from '../../../../components/actionOptions'
import Tag from '../../../../components/Tag'
import { permissions } from '../../../../commons/types'
import ReportSrc from '../../reportsSrc'
import { showErrors, getDateRangeFilter, numberFormat } from '../../../../utils'
import ReportInventoryDetailDrawer from './reportInventoryDetailDrawer'

const { getFormattedValue } = numberFormat()
const { RangePicker } = DatePicker
const { Search } = Input
const { Option } = Select

const getColumns = ({ handlerEditRow }) => [
  {
    title: 'Codigo',
    dataIndex: 'code', // Field that is goint to be rendered
    key: 'code',
    render: text => <span>{text}</span>,
  },  
  {
    title: 'Nombre',
    dataIndex: 'description', // Field that is goint to be rendered
    key: 'description',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Costo Unitario Promedio',
    dataIndex: 'inventory_unit_value', // Field that is goint to be rendered
    key: 'inventory_unit_value',
    render: text => <span>{Number(text).toFixed(2)}</span>,
  },
  {
    title: 'Existencias',
    dataIndex: 'stock', // Field that is goint to be rendered
    key: 'stock',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Valor total',
    dataIndex: 'inventory_total_value', // Field that is goint to be rendered
    key: 'inventory_total_value',
    render: text => <span>{Number(text).toFixed(2)}</span>,
  },
  {
    title: 'Categoria',
    dataIndex: 'product_category', // Field that is goint to be rendered
    key: 'product_category',
    render: text => <Tag type='productCategories' value={text} />,
  },
  {
    title: 'Estado',
    dataIndex: 'status', // Field that is goint to be rendered
    key: 'status',
    render: text => <Tag type='productStatus' value={text} />,
  },
  {
    title: '',
    dataIndex: 'product_id', // Field that is goint to be rendered
    key: 'product_id',
    render: (_, data) => (
      <ActionOptions
        editPermissions={false}
        data={data}
        permissionId={permissions.REPORTES}
        handlerEditRow={handlerEditRow}
        editAction='show'
      />
    ),
  },
]

const getTotals = productsList =>{
return productsList.reduce(
    (result, p) => ({
      totalValue: result.totalValue + Number(p.inventory_total_value),
      totalItems: result.totalItems + Number(p.stock)
    }),
    {
      totalValue: 0,
      totalItems: 0
    }
  )

  }
function ReportInventoryTable(props) {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      start_date: '',
      end_date: '',
      code: '',
      description: '',
      product_category: '',
    }
  }

  const [filters, setFilters] = useState(initFilters.current)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [detailData, setDetailData] = useState([])
  const [productCategoriesList, setProductCategoriesList] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [totals, setTotals] = useState({ totalValue: 0,totalItems: 0 })

  useEffect(() => {
    ReportSrc.getProductsCategories()
      .then(data => setProductCategoriesList(data))
      .catch(error => showErrors(error))
  }, [])

  // useEffect(() => {
  //   if (!props.modalDateRange || props.isModalVisible) return
  //   setSearchFilters('dateRange')(props.modalDateRange)
  // }, [props.modalDateRange, props.isModalVisible])

useEffect(() => {
    if (props.exportData){      
      exportDataToFile()
    }     
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.exportData])

  const exportDataToFile = () => {    
    setLoading(true)    
    ReportSrc.exportReport({
      ...getDateRangeFilter(filters.dateRange),
      code: { $like: `%25${filters.code || ''}%25` },
      description: { $like: `%25${filters.description || ''}%25` },
      product_category: filters.product_category,
      reportType:"inventoryReport"
    })
      .then(data => exportExcel(data.reportExcel))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))

    props.exportDataResponse()
  }

  const exportDataDetailToFile = data => {
    if(data.length > 0){
      console.log("exportar la data detalle ***" ,data)    
      setLoading(true)    
      ReportSrc.exportReport({
        ...getDateRangeFilter(filters.dateRange),
        code: { $like: `%25${filters.code || ''}%25` },
        description: { $like: `%25${filters.description || ''}%25` },
        product_category: filters.product_category,
        reportType:"inventoryReportDetail",
        product_id:data[0].product_id
      })
        .then(data => exportExcel(data.reportExcel))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
  
      props.exportDataResponse()
    }
    
  }

  const exportExcel = (base64Excel) =>{
    try{      
      let uri = 'data:application/octet-stream;base64,'+base64Excel;
      let link = document.createElement('a');
      link.setAttribute("download", `Reporte-inventario.xls`);
      link.setAttribute("href", uri);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(document.body.lastChild);                    
    }catch (e) {
      console.log('ERROR ON EXPORT MANIFEST',e)            
      message.warning('Error al exportar el manifiesto')
    }finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    // if (!filters.dateRange) return
    setLoading(true)
    ReportSrc.getInventory({
      ...getDateRangeFilter(filters.dateRange),
      code: { $like: `%25${filters.code || ''}%25` },
      description: { $like: `%25${filters.description || ''}%25` },
      product_category: filters.product_category,
    })
      .then(data => setDataSource(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    setTotals(getTotals(dataSource))
  }, [dataSource])

  const handlerEditRow = data => {
    setShowDrawer(true)
    setDetailData(data.inventory_movements)
  }

  const setSearchFilters = field => value => {
    // if (field === 'dateRange' && !value) return

    setFilters(prevState => ({ ...prevState, [field]: value }))
  }

  const columns = getColumns({ handlerEditRow })

  return (
    <>
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Search
              prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
              placeholder='Buscar por codigo de producto'
              className={'cabisa-table-search customSearch'}
              size={'large'}
              onSearch={setSearchFilters('code')}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Search
              prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
              placeholder='Buscar por nombre de producto'
              className={'cabisa-table-search customSearch'}
              size={'large'}
              onSearch={setSearchFilters('description')}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              format='DD-MM-YYYY'
              value={filters.dateRange}
              onChange={setSearchFilters('dateRange')}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Select
              className={'single-select'}
              placeholder={'Tipo de servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={setSearchFilters('product_category')}
              defaultValue=''
            >
              <Option value={''}>
                <AntTag color='gray'>Todo</AntTag>
              </Option>
              {productCategoriesList?.map(value => (
                <Option key={value} value={value}>
                  <Tag type='productCategories' value={value} />
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
                    scroll={{ y: 320 }}
                    className={'CustomTableClass'}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    loading={props.loading}
                    rowKey='product_id'
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Valor total de Inventario :'
                value={getFormattedValue(totals.totalValue)}
              />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total articulos del Inventario :'
                value={totals.totalItems}
              />
            </div>
          </Col>
        </Row>
      </Spin>

      <ReportInventoryDetailDrawer
        detailData={detailData}
        showDrawer={showDrawer}
        onClose={() => setShowDrawer(false)}
        exportDataDetailToFile={(data) =>exportDataDetailToFile(data)}
      />
    </>
  )
}

export default ReportInventoryTable
