import React from 'react'
import { Col, DatePicker, Input, Row, Select, Tag as AntTag } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import Tag from '../../../../components/Tag'

const { Search } = Input
const { Option } = Select

function ReportAccountsReceivableFilters(props) {
  return (
    <>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por cliente'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.setSearchFilters('stakeholder_name')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Seleccione Estado de Credito'}
            size={'large'}
            style={{ width: '100%' }}
            getPopupContainer={trigger => trigger.parentNode}
            optionFilterProp='children'
            showSearch
            onChange={props.setSearchFilters('credit_status')}
            value={props.filters.credit_status}
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.creditStatusOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='creditStatus' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Tipo de cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={props.setSearchFilters('stakeholder_type')}
            value={props.filters.stakeholder_type}
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.stakeholderTypesOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='stakeholderTypes' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha de Facturacion'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            format='DD-MM-YYYY'
            onChange={props.setSearchFilters('created_at')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha a pagar'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            format='DD-MM-YYYY'
            onChange={props.setSearchFilters('credit_due_date')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha pago realizado'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            format='DD-MM-YYYY'
            onChange={props.setSearchFilters('credit_paid_date')}
          />
        </Col>
      </Row>
    </>
  )
}

export default ReportAccountsReceivableFilters
