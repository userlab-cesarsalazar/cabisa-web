import React from 'react'
import moment from 'moment'
import {
  List,
  Col,
  Input,
  Row,
  Button,
  Select,
  Popconfirm,
  DatePicker,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import Tag from '../../../components/Tag'

const { Option } = Select

const getColConfig = forbidEdition => ({
  paymentDate: 8,
  paymentAmount: forbidEdition ? 8 : 7,
  paymentMethod: forbidEdition ? 8 : 7,
  deleteButton: forbidEdition ? 0 : 2,
})

function PaymentsList({
  dataSource,
  forbidEdition,
  paymentMethodsOptionsList,
  handleChangePayments,
  handleAddPayments,
  handleRemovePayments,
  ...props
}) {
  const colConfig = getColConfig(forbidEdition)

  return (
    <List
      {...props}
      className={'payments-list'}
      size='small'
      rowKey='index'
      dataSource={dataSource}
      header={
        <Row className='section-space-field'>
          <Col sm={colConfig.paymentDate}>
            <b className='center-flex-div'>Fecha de Pago</b>
          </Col>
          <Col sm={colConfig.paymentAmount}>
            <b className='center-flex-div'>Monto</b>
          </Col>
          <Col sm={colConfig.paymentMethod}>
            <b className='center-flex-div'>Metodo de Pago</b>
          </Col>
          <Col sm={colConfig.deleteButton}></Col>
        </Row>
      }
      renderItem={(row, index) => (
        <List.Item>
          <Row gutter={16} className='list-item-padding w-100 list-item-row'>
            <Col sm={colConfig.paymentDate}>
              <DatePicker
                style={{ width: '100%', height: '40px', borderRadius: '8px' }}
                placeholder='Fecha de pago'
                format='DD-MM-YYYY'
                value={row.payment_date ? moment(row.payment_date) : ''}
                onChange={value =>
                  handleChangePayments('payment_date', value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={colConfig.paymentAmount}>
              <Input
                placeholder={'Monto del pago'}
                size={'large'}
                style={{ height: '40px' }}
                value={row.payment_amount}
                onChange={e =>
                  handleChangePayments('payment_amount', e.target.value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={colConfig.paymentMethod}>
              <Select
                className={'single-select'}
                placeholder={'Metodo de pago'}
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={value =>
                  handleChangePayments('payment_method', value, index)
                }
                value={row.payment_method}
                disabled={forbidEdition}
              >
                {paymentMethodsOptionsList?.length > 0 ? (
                  paymentMethodsOptionsList.map(value => (
                    <Option key={value} value={value}>
                      <Tag type='documentsPaymentMethods' value={value} />
                    </Option>
                  ))
                ) : (
                  <Option value={row.payment_method}>
                    <Tag
                      type='documentsPaymentMethods'
                      value={row.payment_method}
                    />
                  </Option>
                )}
              </Select>
            </Col>
            <Col sm={colConfig.deleteButton}>
              {!forbidEdition && (
                <Popconfirm
                  title={'¿Seguro de eliminar este pago?'}
                  onConfirm={() => handleRemovePayments(index)}
                >
                  <span className='delete-btn'>
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
      footer={
        !forbidEdition && (
          <Row gutter={16} className={'section-space-field'}>
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
        )
      }
    />
  )
}

export default PaymentsList
