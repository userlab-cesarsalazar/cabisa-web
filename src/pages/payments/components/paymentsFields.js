import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Statistic,
  Typography,
  Collapse,
  DatePicker,
  Popconfirm,
  Tooltip,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PaymentsProductsList from './paymentsProductsList'
import Tag from '../../../components/Tag'
import { useEditableList } from '../../../hooks'
import { showErrors, formatPhone, numberFormat } from '../../../utils'
import FooterButtons from '../../../components/FooterButtons'
import DynamicTable from '../../../components/DynamicTable'
import { editableListInitRow } from '../../billing/components/billingFields'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input
const { Panel } = Collapse

const { getFormattedValue } = numberFormat()

const getPaymentsColumns = ({
  handleChangePayments,
  handleRemovePayments,
  paymentMethodsOptionsList,
}) => [
  {
    title: 'Fecha de Pago',
    dataIndex: 'payment_date', // Field that is goint to be rendered
    key: 'payment_date',
    render: (_, record, rowIndex) => (
      <DatePicker
        style={{ width: '100%', height: '40px', borderRadius: '8px' }}
        placeholder='Fecha final'
        format='DD-MM-YYYY'
        value={record.payment_date ? moment(record.payment_date) : ''}
        onChange={value =>
          handleChangePayments('payment_date', value, rowIndex)
        }
      />
    ),
  },
  {
    title: 'Monto',
    dataIndex: 'payment_amount', // Field that is goint to be rendered
    key: 'payment_amount',
    render: (_, record, rowIndex) => (
      <Input
        placeholder={'Monto del pago'}
        size={'large'}
        style={{ height: '40px' }}
        value={record.payment_amount}
        onChange={e =>
          handleChangePayments('payment_amount', e.target.value, rowIndex)
        }
      />
    ),
  },
  {
    title: 'Metodo de pago',
    dataIndex: 'payment_method', // Field that is goint to be rendered
    key: 'payment_method',
    render: (_, record, rowIndex) => (
      <Select
        className={'single-select'}
        placeholder={'Metodo de pago'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
        getPopupContainer={trigger => trigger.parentNode}
        onChange={value =>
          handleChangePayments('payment_method', value, rowIndex)
        }
        value={record.payment_method}
      >
        {paymentMethodsOptionsList?.length > 0 ? (
          paymentMethodsOptionsList.map(value => (
            <Option key={value} value={value}>
              <Tag type='documentsPaymentMethods' value={value} />
            </Option>
          ))
        ) : (
          <Option value={record.payment_method}>
            <Tag type='documentsPaymentMethods' value={record.payment_method} />
          </Option>
        )}
      </Select>
    ),
  },
  {
    title: '',
    dataIndex: 'payment_id', // Field that is goint to be rendered
    key: 'payment_id',
    render: (_, __, rowIndex) => (
      <Tooltip title='Eliminar' color='red'>
        <Popconfirm
          title={`¿Estas seguro de borrar el elemento seleccionado?`}
          onConfirm={() => handleRemovePayments(rowIndex)}
          okText='Si'
          cancelText='No'
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Tooltip>
    ),
  },
]

const getPaymentsTotal = payments =>
  payments?.reduce(
    (r, p) => ({
      totalPayments: (r.totalPayments || 0) + Number(p.payment_amount),
    }),
    {}
  )

const getSaveData = data => {
  const payments = data.payments?.map(p => ({
    payment_date: p?.payment_date
      ? new Date(p.payment_date).toISOString()
      : null,
    payment_amount: Number(p?.payment_amount),
    payment_method: p?.payment_method,
  }))

  return { document_id: data?.id, payments }
}

const validateSaveData = data => {
  const errors = []
  const requiredFields = [
    { key: 'payment_date', value: 'Fecha de Pago' },
    { key: 'payment_amount', value: 'Monto' },
    { key: 'payment_method', value: 'Metodo de pago' },
  ]

  const requiredErrors = data.payments?.flatMap((p, i) => {
    const hasError = requiredFields.some(field => !p[field.key])
    return hasError ? i + 1 : []
  })

  if (requiredErrors.length > 0) {
    requiredErrors.forEach(position => {
      errors.push(
        `Debe llenar todos lo campos del pago en la posicion ${position}`
      )
    })
  }

  return {
    isInvalid: errors.length > 0,
    error: {
      message: errors,
    },
  }
}

function PaymentsFields({ setLoading, detailData, ...props }) {
  const [paymentsData, setPaymentsData] = useState([])
  const [totalPayments, setTotalPayments] = useState(0)
  const [invoiceData, setInvoiceData] = useState({})
  const [productsData, setProductsData] = useState([])

  useEffect(() => {
    if (!detailData) return
    console.log(detailData)
    setPaymentsData(detailData?.payments || [])

    setInvoiceData(prevState => ({
      ...detailData,
      stakeholder_phone: formatPhone(detailData.stakeholder_phone),
      ...prevState,
    }))

    setProductsData(prevState =>
      prevState?.length > 1 ? prevState : detailData.products
    )
  }, [detailData])

  useEffect(() => {
    if (paymentsData?.length === 0) return

    const totals = getPaymentsTotal(paymentsData)

    setTotalPayments(totals?.totalPayments)
  }, [paymentsData])

  useEffect(function cleanUp() {
    return () => {
      setInvoiceData({})
      setProductsData([])
      setPaymentsData([])
      setTotalPayments(0)
    }
  }, [])

  useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: editableListInitRow,
  })

  const {
    handleChange: handleChangePayments,
    handleAdd: handleAddPayments,
    handleRemove: handleRemovePayments,
  } = useEditableList({
    state: paymentsData,
    setState: setPaymentsData,
    minimumLength: 0,
    initRow: {
      payment_date: '',
      payment_amount: '',
      payment_method: '',
    },
  })

  const paymentsColumns = getPaymentsColumns({
    handleChangePayments,
    handleRemovePayments,
    paymentMethodsOptionsList: props.paymentMethodsOptionsList,
  })

  const saveData = () => {
    const saveData = getSaveData({ ...invoiceData, payments: paymentsData })

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)
    console.log(saveData)
    // props.handleSaveData(saveData)
  }

  return (
    <>
      <Row>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Title>Pagos</Title>
        </Col>
      </Row>

      <Divider className={'divider-custom-margins-users'} />

      <Collapse>
        <Panel header='Factura' key='1'>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Serie</div>
              <Input
                placeholder={'Serie'}
                size={'large'}
                style={{ height: '40px' }}
                value={invoiceData?.id}
                disabled
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Estado de Credito</div>
              <Select
                className={'single-select'}
                placeholder={'Estado de Credito'}
                size={'large'}
                style={{ width: '100%' }}
                value={invoiceData?.credit_status}
                disabled
              >
                <Option value={invoiceData?.credit_status}>
                  <Tag type='creditStatus' value={invoiceData?.credit_status} />
                </Option>
              </Select>
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Metodo de pago</div>
              <Select
                className={'single-select'}
                placeholder={'Metodo de pago'}
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                value={invoiceData?.payment_method}
                disabled
              >
                <Option value={invoiceData?.payment_method}>
                  <Tag
                    type='documentsPaymentMethods'
                    value={invoiceData?.payment_method}
                  />
                </Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Cliente</div>
              <Select
                disabled
                className={'single-select'}
                placeholder={'Buscar cliente'}
                size={'large'}
                style={{ width: '100%' }}
                value={invoiceData?.stakeholder_id}
              >
                <Option value={invoiceData?.stakeholder_id}>
                  {invoiceData?.stakeholder_name}
                </Option>
              </Select>
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Tipo de cliente</div>
              <Select
                className={'single-select'}
                placeholder={'Elegir tipo de cliente'}
                size={'large'}
                style={{ width: '100%' }}
                value={invoiceData?.stakeholder_type}
                disabled
              >
                <Option value={invoiceData?.stakeholder_type}>
                  <Tag
                    type='stakeholderTypes'
                    value={invoiceData?.stakeholder_type}
                  />
                </Option>
              </Select>
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Proyecto</div>
              <Select
                className={'single-select'}
                placeholder={'Proyecto'}
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                value={invoiceData?.project_id}
                disabled
              >
                <Option value={invoiceData?.project_id}>
                  {invoiceData?.project_name}
                </Option>
              </Select>
            </Col>
          </Row>
        </Panel>
        <Panel header='Detalle Factura' key='2'>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>NIT</div>
              <Input
                placeholder={'Escribir NIT'}
                size={'large'}
                style={{ height: '40px' }}
                value={invoiceData?.stakeholder_nit}
                disabled
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Email</div>
              <Input
                placeholder={'Escribir email'}
                size={'large'}
                type={'email'}
                style={{ height: '40px' }}
                value={invoiceData?.stakeholder_email}
                disabled
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Telefono</div>
              <Input
                placeholder={'Escribir telefono'}
                size={'large'}
                style={{ height: '40px' }}
                value={invoiceData?.stakeholder_phone}
                disabled
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Direccion</div>
              <Input
                placeholder={'Escribir direccion'}
                size={'large'}
                style={{ height: '40px' }}
                value={invoiceData?.stakeholder_address}
                disabled
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              {invoiceData?.credit_days ? (
                <>
                  <div className={'title-space-field'}>Dias de Credito</div>
                  <Select
                    className={'single-select'}
                    placeholder={'Dias de credito'}
                    size={'large'}
                    style={{ width: '100%', height: '40px' }}
                    value={invoiceData?.credit_days}
                    disabled
                  >
                    <Option value={invoiceData?.credit_days}>
                      {invoiceData?.credit_days}
                    </Option>
                  </Select>
                </>
              ) : null}
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              {invoiceData?.discount_percentage ? (
                <>
                  <div className={'title-space-field'}>Descuento (%)</div>
                  <Input
                    type='tel'
                    placeholder={'Aplicar Descuento'}
                    size={'large'}
                    style={{ height: '40px', width: '100%' }}
                    value={invoiceData?.discount_percentage}
                    disabled
                  />
                </>
              ) : null}
            </Col>
          </Row>

          <Divider className={'divider-custom-margins-users'} />

          <PaymentsProductsList
            dataSource={invoiceData?.products}
            handleAddDetail={() => () => {}}
            handleChangeDetail={() => () => {}}
            handleRemoveDetail={() => () => {}}
            handleBlurDetail={() => () => {}}
            handleSearchProduct={() => () => {}}
            handleSearchChildProduct={() => () => {}}
            productsOptionsList={[]}
            childProductsOptionsList={[]}
            serviceTypesOptionsList={[]}
            isInvoiceFromSale={true}
          />

          <Divider className={'divider-custom-margins-users'} />

          <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
            <Col span={6} style={{ textAlign: 'right' }}>
              {invoiceData?.total_discount_amount ? (
                <div className={'title-space-field'}>
                  <Statistic
                    title='Descuento :'
                    value={getFormattedValue(
                      invoiceData?.total_discount_amount
                    )}
                  />
                </div>
              ) : null}
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Subtotal :'
                  value={getFormattedValue(invoiceData?.subtotal_amount)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Impuesto :'
                  value={getFormattedValue(invoiceData?.total_tax_amount)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total :'
                  value={getFormattedValue(invoiceData?.total_amount)}
                />
              </div>
            </Col>
          </Row>

          <Divider className={'divider-custom-margins-users'} />

          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={'title-space-field'}>
                <b>Descripcion</b>
              </div>
              <TextArea rows={4} value={invoiceData?.description} disabled />
            </Col>
          </Row>
        </Panel>
      </Collapse>

      <Divider className={'divider-custom-margins-users'} />

      <div>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <DynamicTable columns={paymentsColumns} data={paymentsData} />
          </Col>
        </Row>

        <Row gutter={16} className={'section-space-list'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Button
              type='dashed'
              className={'shop-add-turn'}
              onClick={handleAddPayments}
            >
              Agregar Pago
            </Button>
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            {paymentsData.length > 0 ? (
              <div className={'title-space-field'}>
                <Statistic
                  title='Total pagos :'
                  value={getFormattedValue(totalPayments)}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </div>

      <FooterButtons
        saveData={saveData}
        edit
        cancelButton={props.cancelButton}
        loading={props.loading}
      />
    </>
  )
}
export default PaymentsFields
