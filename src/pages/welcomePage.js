import React, { useEffect } from 'react'
import { Row, Col, Carousel, Image } from 'antd'
import { withRouter } from 'react-router'

function WelcomePage() {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Row justify='space-around' align='middle'>
        <Col span={24} className={'block-scroll'}>
          <Carousel autoplay className={'image-box-shadow'}>
            <Image
              className={'cover-image'}
              height={'90vh'}
              width={'105%'}
              preview={false}
              src='cabisaWelcome.png'
            />
          </Carousel>
        </Col>
      </Row>
    </div>
  )
}
export default withRouter(WelcomePage)
