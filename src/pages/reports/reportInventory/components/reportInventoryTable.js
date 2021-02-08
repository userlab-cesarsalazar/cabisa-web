import React from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
  Tag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
const { Search } = Input
const { Option } = Select
const columns = [
  {
    title: 'Codigo',
    dataIndex: 'code', // Field that is goint to be rendered
    key: 'code',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Serie',
    dataIndex: 'serie', // Field that is goint to be rendered
    key: 'serie',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Costos',
    dataIndex: 'price', // Field that is goint to be rendered
    key: 'price',
    render: text => <span>{text}</span>,
  },

  {
    title: 'Estado',
    dataIndex: 'status', // Field that is goint to be rendered
    key: 'status',
    render: text => (
      <span>
        {text === 'Activo' ? (
          <Tag color='#87d068'>ACTIVO</Tag>
        ) : text === 'InActivo' ? (
          <Tag color='#f50'>INACTIVO</Tag>
        ) : (
          ''
        )}
      </span>
    ),
  },
  {
    title: '',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: (row, data) => (
      <span>
        {
          <Popover
            placement='left'
            style={{ zIndex: 'auto' }}
            content={
              <div>
                <span className={'user-options-items'}>Editar</span>
                <Divider
                  className={'divider-enterprise-margins'}
                  type={'horizontal'}
                />
                <Popconfirm
                  title='Estas seguro de borrar el elemento selccionado?'
                  okText='Si'
                  cancelText='No'
                >
                  <span className={'user-options-items'}>Eliminar</span>
                </Popconfirm>
              </div>
            }
            trigger='click'
          >
            <Button shape={'circle'} className={'enterprise-settings-button'}>
              <MoreOutlined />
            </Button>
          </Popover>
        }
      </span>
    ),
  },
]

function ReportInventoryTable(props) {
  return (
    <>
      {/*FIELDS*/}
      <Row gutter={16}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            className={'cabisa-table-search customSearch'}
            size={'large'}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Elegir estatus'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={'active'}>
              <Tag color='#87d068'>ACTIVO</Tag>
            </Option>
            <Option value={'inactive'}>
              <Tag color='#f50'>INACTIVO</Tag>
            </Option>
          </Select>
        </Col>
      </Row>
      {/*TABLE*/}
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 320 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  loading={props.loading}
                  rowKey='id'
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ReportInventoryTable
