import React from 'react'
import { Button, Card, Col, Divider, Row } from 'antd'
import { Link } from 'react-router-dom'

function FooterButtons(props) {
  const saveData = () => {
    props.saveData()
  }

  return (
    <div>
      <Divider className={'divider-custom-margins-users'} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className='text-right'>
            <div>
              {props.edit ? (
                <Button
                  type={'link'}
                  onClick={() => props.cancelButton()}
                  className='cancel-button'
                >
                  Cancelar
                </Button>
              ) : (
                <Link to={props.cancelLink} className='cancel-button'>
                  Cancelar
                </Link>
              )}
              <Button
                className='title-cabisa new-button'
                onClick={() => saveData()}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
export default FooterButtons
