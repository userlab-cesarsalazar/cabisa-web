import React from 'react'
import {
  Table,
  Col,
  Input,
  Button,
  Row,
  Card,
  Popover,
  Divider,
  Popconfirm,
  Tag,
  Select,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

const { Search } = Input
const { Option } = Select

function InventoryTable(props) {
  const columns = [
    {
      title: 'Codigo',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      title: '# Serie',
      dataIndex: 'serie', // Field that is goint to be rendered
      key: 'serie',
      render: text => <span>{text}</span>,
    },
    {
      title: '# Motor',
      dataIndex: 'engine', // Field that is goint to be rendered
      key: 'engine',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Descripcion',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Categoria',
      dataIndex: 'type', // Field that is goint to be rendered
      key: 'type',
      render: text => (
        <span>
          {text === 0 ? (
            <Tag color='#87d068'>Servicio</Tag>
          ) : text === 1 ? (
            <Tag color='#f50'>Equipo</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'Costo',
      dataIndex: 'price', // Field that is goint to be rendered
      key: 'price',
      render: text => <span>{text}</span>,
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
                  <span
                    className={'user-options-items'}
                    onClick={() => handlerEditRow(data)}
                  >
                    Editar
                  </span>
                  <Divider
                    className={'divider-enterprise-margins'}
                    type={'horizontal'}
                  />

                  <Popconfirm
                    title='Estas seguro de borrar el elemento selccionado?'
                    onConfirm={() => handlerDeleteRow(data)}
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

  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={10} sm={10} md={10} lg={10}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            className={'cabisa-table-search customSearch'}
            style={{ width: '100%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            className={'single-select'}
            placeholder={'Categoria'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>
              <Tag color='#87d068'>Servicio</Tag>
            </Option>
            <Option value={1}>
              <Tag color='#f50'>Equipo</Tag>
            </Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'right' }}>
          <Button
            className='title-cabisa new-button'
            onClick={props.showDraweTbl}
          >
            Nuevo Item
          </Button>
        </Col>
      </Row>
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

export default InventoryTable
