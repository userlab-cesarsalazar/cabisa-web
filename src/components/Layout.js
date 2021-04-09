import React from 'react'
import { Layout } from 'antd'
const { Content, Footer } = Layout

function CabisaLayout(props) {
    return (
        <div>
            <Layout className={'site-layout-background'}>
                {props.children}
            </Layout>
            <Content>
                <Footer className={'center-flex-div'} style={{background:"red"}}>
                    Cabisa ©2021 - V {process.env.REACT_APP_VERSION} (develop)
                </Footer>
            </Content>
        </div>
    )
}

export default CabisaLayout
