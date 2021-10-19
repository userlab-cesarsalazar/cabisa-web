import React from 'react'
import debounce from 'lodash/debounce'
import { Col, DatePicker, Row, Select, Tag as AntTag } from 'antd'
import Tag from '../../../../components/Tag'

const { RangePicker } = DatePicker
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
          <Select
            className={'single-select'}
            placeholder={'Buscar por vendedor'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            showSearch
            allowClear
            onSearch={debounce(props.handleSearchSeller, 400)}
            value={props.filters.seller_id}
            onChange={props.setSearchFilters('seller_id')}
            loading={props.loading}
            optionFilterProp='children'
          >
            {props.sellersOptionsList?.map(seller => (
              <Option key={seller.id} value={seller.id}>
                {seller.full_name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Buscar por cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            allowClear
            showSearch
            onSearch={debounce(props.handleSearchStakeholder, 400)}
            value={props.filters.client_id}
            onChange={props.setSearchFilters('client_id')}
            loading={props.loading}
            optionFilterProp='children'
          >
            {props.stakeholdersOptionsList?.map(client => (
              <Option key={client.id} value={client.id}>
                {client.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </>
  )
}

export default ReportSalesFilters
