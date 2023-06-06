import React from 'react'
import {
  List,
  Col,
  Input,
  Row,
  Button,
  Select,
  Popconfirm  
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import CurrencyInput from '../../../components/CurrencyInput'


const { TextArea } = Input
const { Option } = Select

const getColConfig = forbidEdition => ({  
  paymentAmount: 4,
  paymentMethod: 4,
  relatedExternalDocument: 4,
  description: 10,
  deleteButton: forbidEdition ? 0 : 1,
})

function BillingItemList({
  dataSource,
  forbidEdition,  
  handleChangeManualPayments,
  handleAddManualPayments,
  handleRemoveManualPayments,
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
          <Col sm={colConfig.paymentAmount}>
            <b className='center-flex-div'>Monto (Q)</b>
          </Col>
          <Col sm={colConfig.paymentAmount}>
            <b className='center-flex-div'>Cantidad</b>
          </Col>
          <Col sm={colConfig.paymentMethod}>
            <b className='center-flex-div'>Bien/Servicio</b>
          </Col>          
          <Col sm={colConfig.description}>
            <b className='center-flex-div'>Descripcion</b>
          </Col>
          <Col sm={colConfig.deleteButton}></Col>
        </Row>
      }
      renderItem={(row, index) => (
        <List.Item>
          <Row gutter={16} className='list-item-padding w-100 list-item-row'>            
            <Col sm={colConfig.paymentAmount}>
              <CurrencyInput
                placeholder={'Monto'}
                size={'large'}
                style={{ height: '40px' }}
                value={row.payment_amount}
                onChange={value =>
                  handleChangeManualPayments('payment_amount', value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={colConfig.paymentAmount}>
              <CurrencyInput
              className='product-list-input'
                type='tel'
                fractionDigits={0}                                      
                placeholder={'Cantidad'}
                size={'large'}
                style={{ height: '40px' }}
                value={row.payment_qty}
                onChange={value =>
                  handleChangeManualPayments('payment_qty', value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={colConfig.paymentMethod}>
              <Select
                className={'single-select'}
                placeholder={'Bien/Servicio'}
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                getPopupContainer={trigger => trigger.parentNode}
                onChange={value =>
                  handleChangeManualPayments('payment_method', value, index)
                }
                value={row.payment_method}
                disabled={forbidEdition}
              >
                    <Option key={"B"} value={"B"}>
                      <span>Bien</span>
                    </Option>                    
              </Select>
            </Col>            
            <Col sm={colConfig.description}>
              <TextArea
                rows={2}
                placeholder={'Descripcion'}
                value={row.description}
                onChange={e =>
                  handleChangeManualPayments('description', e.target.value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={colConfig.deleteButton}>
              {!forbidEdition && (
                <Popconfirm
                  title={'¿Seguro de eliminar este pago?'}
                  onConfirm={() => handleRemoveManualPayments(index)}
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
            <Col span={12} offset={6}>
              <Button
                type='dashed'
                className={'shop-add-turn'}
                onClick={handleAddManualPayments}
              >
                Agregar
              </Button>
            </Col>
          </Row>
        )
      }
    />
  )
}

export default BillingItemList
