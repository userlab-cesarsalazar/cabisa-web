import React from 'react'
import { Button, Col, Row, Typography } from 'antd'
// Context
import { validatePermissions } from '../utils/Utils'
import { Cache } from 'aws-amplify'
const { Title } = Typography

function HeaderPage(props) {
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
          {props.titleButton && (
            <Button
              className={
                validatePermissions(
                  Cache.getItem('currentSession').userPermissions,
                  props.permissions
                ).permissionsSection[0].create
                  ? 'title-cabisa new-button'
                  : 'hide-component title-cabisa new-button'
              }
              onClick={handlerShowDrawer}
            >
              {props.titleButton}
            </Button>
          )}
        </Col>
      </>
    </Row>
  )
}

export default HeaderPage
