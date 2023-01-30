import React, { useEffect, useState, useRef, useCallback } from 'react'
import moment from 'moment'
import { message, Row, Col, Statistic, Divider,Tag as AntTag } from 'antd'
import GenericTable from '../../../components/genericTable'
import ReportSalesFilters from './components/reportSalesFilters'
import HeaderPage from '../../../components/HeaderPage'
import Tag from '../../../components/Tag'
import ReportsSrc from '../reportsSrc'
import { showErrors, getDateRangeFilter, numberFormat } from '../../../utils'
import { stakeholdersStatus, stakeholdersTypes, permissions } from '../../../commons/types'

const { getFormattedValue } = numberFormat()

const getTotals = invoicesList =>
  invoicesList.reduce(
    (result, invoice) => {
      const isTotallyPaid =
        Number(invoice.paid_credit_amount) === Number(invoice.total_amount)
      const paidInvoicesSalesCommissionTotal =
        result.paidInvoicesSalesCommissionTotal +
        (isTotallyPaid ? Number(invoice.sales_commission_amount) : 0)
      const salesCommissionTotal =
        result.salesCommissionTotal + Number(invoice.sales_commission_amount)

      return {
        paidInvoicesSalesCommissionTotal,
        unpaidInvoicesSalesCommissionTotal:
          salesCommissionTotal - paidInvoicesSalesCommissionTotal,
        salesCommissionTotal,
        paidInvoicesTotal:
          result.paidInvoicesTotal +
          (isTotallyPaid ? Number(invoice.total_amount) : 0),
        invoicesTotal: result.invoicesTotal + Number(invoice.total_amount),
      }
    },
    {
      paidInvoicesSalesCommissionTotal: 0,
      unpaidInvoicesSalesCommissionTotal: 0,
      salesCommissionTotal: 0,
      paidInvoicesTotal: 0,
      invoicesTotal: 0,
    }
  )

const columns = [
  {
    title: 'Tipo',
    dataIndex: 'document_type', // Field that is goint to be rendered
    key: 'document_type',
    render: text => text === "RENT_INVOICE" ? <AntTag color='#87d067'>Nota de servicio</AntTag> : <AntTag color='#187fce'>Factura Manual</AntTag>,
  },

  {
    title: '# Nota serv.',
    dataIndex: 'related_internal_document_id', // Field that is goint to be rendered
    key: 'related_internal_document_id',
    render: text => <span>{text}</span>,
  },
  {
    title: '# Documento',
    dataIndex: 'document_number', // Field that is goint to be rendered
    key: 'document_number',
    render: text => <span>{text ? text : 'Factura Sistema'}</span>,
  },
  {
    title: 'Fecha',
    dataIndex: 'created_at', // Field that is goint to be rendered
    key: 'created_at',
    render: text =>
      text ? <span>{moment(text).format('DD-MM-YYYY hh:mm:ss A')}</span> : null,
  },
  {
    title: 'Metodo de pago',
    dataIndex: 'payment_method', // Field that is goint to be rendered
    key: 'payment_method',
    render: text => <Tag type='documentsPaymentMethods' value={text} />,
  },
  {
    title: 'Monto',
    dataIndex: 'total_amount', // Field that is goint to be rendered
    key: 'total_amount',
    render: text => <span>{`Q ${getFormattedValue(text.toFixed(2))}`}</span>,
  },
  {
    title: 'Cliente',
    dataIndex: 'stakeholder_name', // Field that is goint to be rendered
    key: 'stakeholder_name',
    render: text => <span>{text}</span>,
  },
  {    
    title: 'Estado',
    dataIndex: 'credit_status', // Field that is goint to be rendered
    key: 'credit_status',
    render: text => <Tag type='creditStatus' value={text} />
  }
]

function ReportSales() {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      start_date: '',
      end_date: '',
      payment_method: '',
      document_type: '',
      seller_id: null,
      client_id: null,
    }
  }

  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initFilters.current)
  const [dataSource, setDataSource] = useState([])
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [sellersOptionsList, setSellersOptionsList] = useState([])
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [totals, setTotals] = useState({})

  const fetchSales = useCallback(() => {
    setLoading(true)

    ReportsSrc.getSales({
      ...getDateRangeFilter(filters.dateRange),
      payment_method: filters.payment_method,
      document_type: filters.document_type,
      seller_id: filters.seller_id,
      client_id: filters.client_id,
    })
      .then(result => setDataSource(result))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  useEffect(() => {
    setLoading(true)

    ReportsSrc.getPaymentMethods()
      .then(data => setPaymentMethodsOptionsList(data))
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setTotals(getTotals(dataSource))
  }, [dataSource])

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  const handleSearchSeller = (seller_name = '') => {
    const params = {
      full_name: { $like: `%25${seller_name}%25` },
      rol_id: { $in: '1,2' },
      is_active: 1,
    }

    setLoading(true)

    ReportsSrc.getSellersOptions(params)
      .then(data => setSellersOptionsList(data))
      .catch(_ => message.error('Error al cargar listado de vendedores'))
      .finally(() => setLoading(false))
  }

  const handleSearchStakeholder = stakeholder_name => {
    const params = {
      name: { $like: `%25${stakeholder_name}%25` },
      status: stakeholdersStatus.ACTIVE,
      stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
    }

    setLoading(true)

    ReportsSrc.getStakeholdersOptions(params)
      .then(data => setStakeholdersOptionsList(data))
      .catch(_ => message.error('Error al cargar listado de clientes'))
      .finally(() => setLoading(false))
  }

  const exportDataAction = () => {
    setLoading(true)
    let params = {
      ...getDateRangeFilter(filters.dateRange),
      payment_method: filters.payment_method,
      document_type: filters.document_type,
      seller_id: filters.seller_id,
      client_id: filters.client_id,
      reportType:"salesReport"
    }

    ReportsSrc
      .exportReport(params)
      .then(data => {        
        message.success('Reporte creado')
        exportExcel(data.reportExcel)
      })
      .catch(_ => message.error('Error al cargar reporte facturas'))
      .finally(() => setLoading(false))
  }

  const exportExcel = (base64Excel) =>{
    try{      
      let uri = 'data:application/octet-stream;base64,'+base64Excel;
      let link = document.createElement('a');
      link.setAttribute("download", `Reporte-Orden-servicio.xls`);
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


  return (
    <>
      <HeaderPage 
        title={'Reporte - Ordenes de servicio / Ventas'} 
        titleButton={'Exportar'}
        permissions={permissions.REPORTES}
        showDrawer={exportDataAction}
        />
      <ReportSalesFilters
        loading={loading}
        filters={filters}
        setSearchFilters={setSearchFilters}
        handleSearchSeller={handleSearchSeller}
        sellersOptionsList={sellersOptionsList}
        handleSearchStakeholder={handleSearchStakeholder}
        stakeholdersOptionsList={stakeholdersOptionsList}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
      />
      <GenericTable data={dataSource} loading={loading} columns={columns} />

      <Divider className={'divider-custom-margins-users'} />

      <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>     
        <Col span={5} style={{ textAlign: 'right' }}>
          <div className={'title-space-field'}>
            <Statistic
              title='Total Facturado :'
              value={getFormattedValue(totals.invoicesTotal)}
            />
          </div>
        </Col>
        <Col span={5} style={{ textAlign: 'right' }}>
          <div className={'title-space-field'}>
            <Statistic
              title='Cantidad de documentos :'
              value={dataSource.length}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ReportSales
