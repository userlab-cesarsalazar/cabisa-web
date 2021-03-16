import React, { useContext } from 'react'
import { Button, Col, Row, Typography } from 'antd'
// Context
import { Context, useStore } from '../context'
const { Title } = Typography

function HeaderPage(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)
  const handlerShowDrawer = () => {
    props.showDrawer()
  }

  return (
    <Row
      type='flex'
      justify='center'
      align='top'
      className={props.cleanHeader ? 'margin-clean-top' : 'margin-top-40'}
    >
      <>
        <Col xs={24} sm={24} md={12} lg={20}>
          <Title>{props.title}</Title>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={{ span: 4, offset: 0 }}
          className='text-right'
        >
          {hasPermissions([props.permissions]) && props.title && (
            <Button
              className='title-cabisa new-button'
              onClick={handlerShowDrawer}
            >
              {props.titleButton}
            </Button>
          )}
          {props.bill && (
            <Button className='title-cabisa new-button'>
              Serie No. A-12312
            </Button>
          )}
        </Col>
      </>
    </Row>
  )
}

export default HeaderPage
