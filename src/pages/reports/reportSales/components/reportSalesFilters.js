import React from 'react'
import { Col, DatePicker, Input, Row, Select, Tag as AntTag } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import Tag from '../../../../components/Tag'

const { RangePicker } = DatePicker
const { Search } = Input
const { Option } = Select

function ReportSalesFilters(props) {
  return (
    <>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <RangePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            format='DD-MM-YYYY'
            onChange={props.setSearchFilters('dateRange')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Seleccione Metodo de Pago'}
            size={'large'}
            style={{ width: '100%' }}
            getPopupContainer={trigger => trigger.parentNode}
            optionFilterProp='children'
            showSearch
            onChange={props.setSearchFilters('payment_method')}
            defaultValue=''
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.paymentMethodsOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='documentsPaymentMethods' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Seleccione estado'}
            size={'large'}
            style={{ width: '100%' }}
            getPopupContainer={trigger => trigger.parentNode}
            optionFilterProp='children'
            showSearch
            onChange={props.setSearchFilters('document_type')}
            defaultValue=''
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            <Option value={'INVOICE'}>
              <AntTag color='#187fce'>Factura</AntTag>
            </Option>
            <Option value={'PRE_INVOICE'}>
              <AntTag color='#87d067'>Nota de Servicio</AntTag>
            </Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por vendedor'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.setSearchFilters('seller_name')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por cliente'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.setSearchFilters('stakeholder_name')}
          />
        </Col>
      </Row>
    </>
  )
}

export default ReportSalesFilters
