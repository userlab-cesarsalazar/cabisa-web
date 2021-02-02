import React, { useEffect } from 'react'
import { Row } from 'antd'
import { withRouter } from 'react-router'

function GenericPage(props) {
  useEffect(() => {
    console.log('Iniciando')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Row type='flex' justify='center' align='middle'>
      <h1>Soon!</h1>
    </Row>
  )
}
export default withRouter(GenericPage)
