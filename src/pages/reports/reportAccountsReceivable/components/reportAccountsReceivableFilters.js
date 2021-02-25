import React from 'react'
import { Col, DatePicker, Input, Row, Select, Tag } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

function ReportAccountsReceivableFilters() {
<<<<<<< Updated upstream
  
  return(
    <>
    <Row gutter={16}>
    <Col xs={6} sm={6} md={6} lg={6}>
      <Search
        prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
        placeholder='Presiona enter para buscar'
        className={'cabisa-table-search customSearch'}
        size={'large'}
      />
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <DatePicker
        style={{ width: '100%', height: '40px', borderRadius: '8px' }}
      />
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <Select
        showSearch
        className={'single-select'}
        placeholder={'Tipo cliente'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
        getPopupContainer={trigger => trigger.parentNode}
      >
        <Option value={0}>Persona Individual</Option>
        <Option value={1}>Empresa</Option>
      </Select>
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <DatePicker placeholder={'Fecha de Facturacion'}/>
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <DatePicker placeholder={'Fecha de Pago'}/>
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <DatePicker placeholder={'Fecha de Pago realizado'}/>
    </Col>
    <Col xs={6} sm={6} md={6} lg={6}>
      <Select
        showSearch
        className={'single-select'}
        placeholder={'Situacion'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
        getPopupContainer={trigger => trigger.parentNode}
      >
        <Option value={0}>Persona Individual</Option>
        <Option value={1}>Empresa</Option>
      </Select>
    </Col>
  </Row>
      </>)
    
=======
  return (
    <>
      <Row gutter={16}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            className={'cabisa-table-search customSearch'}
            size={'large'}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Tipo cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>Persona Individual</Option>
            <Option value={1}>Empresa</Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker placeholder={'Fecha de Facturacion'} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker placeholder={'Fecha de Pago'} />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker placeholder={'Fecha de Pago realizado'} />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Situacion'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>Persona Individual</Option>
            <Option value={1}>Empresa</Option>
          </Select>
        </Col>
      </Row>
    </>
  )
>>>>>>> Stashed changes
}
export default ReportAccountsReceivableFilters
