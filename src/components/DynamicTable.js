import React from 'react'
import { Table } from 'antd'

function DynamicTable(props) {
  return (
    <Table
      className={'CustomTableClass'}
      pagination={false}
      columns={props.columns}
      dataSource={props.data?.map((x, index) => ({ ...x, index }))}
      rowKey={'index'}
    />
  )
}

export default DynamicTable
