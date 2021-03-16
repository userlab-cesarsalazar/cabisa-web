import React, { useState } from 'react'
import { Col, DatePicker, Input, Row, Select } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'

const { Search } = Input
const { Option } = Select

function ReportAccountsReceivableFilters(props) {
  const [dataFilters, setDataFilters] = useState({})

  const filterInfo = (value, type) => {
    let tmpState = dataFilters
    switch (type) {
      case 'search':
        tmpState.search = value
        break
      case 'situation':
        tmpState.situation = value
        break
      case 'clientType':
        tmpState.clientType = value
        break
      case 'bill_date':
        tmpState.bill_date = value
        break
      case 'payment_date':
        tmpState.payment_date = value
        break
      case 'recovery_date':
        tmpState.recovery_date = value
        break
      default:
        break
    }
    props.filterData(tmpState)
    setDataFilters(tmpState)
  }

  return (
    <>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={value => filterInfo(value, 'search')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Situacion'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onSelect={value => filterInfo(value, 'situation')}
          >
            <Option value={0}>Al dia</Option>
            <Option value={1}>Moroso</Option>
          </Select>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Tipo cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onSelect={value => filterInfo(value, 'clientType')}
          >
            <Option value={0}>Persona Individual</Option>
            <Option value={1}>Empresa</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha de Facturacion'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            onChange={(data, stringDate) => filterInfo(stringDate, 'bill_date')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha de pago'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            onChange={(data, stringDate) =>
              filterInfo(stringDate, 'payment_date')
            }
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha de Cobro'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            onChange={(data, stringDate) =>
              filterInfo(stringDate, 'recovery_date')
            }
          />
        </Col>
      </Row>
    </>
  )
}
export default ReportAccountsReceivableFilters
