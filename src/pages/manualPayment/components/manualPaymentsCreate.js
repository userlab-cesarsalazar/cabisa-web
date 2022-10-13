import React, { useCallback, useEffect, useState, useRef } from 'react'
import debounce from 'lodash/debounce'
import moment from 'moment'
import PaymentsSrc from '../manualPaymentsSrc'
import billingSrc from '../../billing/billingSrc'
import { Button,
    Col,
    Divider,
    Input,
    message,
    Row,
    Select,
    Statistic,
    Typography,Modal,Spin } from 'antd'
    import Tag from '../../../components/Tag'
import { ConsoleLogger } from '@aws-amplify/core'
    const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

function PaymentsCreate(props) {

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)  
  const [showModal,setShowModal] = useState(false)

  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [projectsOptionsList, setProjectsOptionsList] = useState([])
  const [data, setData] = useState({})

  useEffect(() => {
    setLoading(true)
    
    if(props.showModal){
        const params = {        
            status: 'ACTIVE',
            stakeholder_type: { $ne: 'PROVIDER' },
            $limit: 10,
            name: { $like: '%25%25' },        
          }
        billingSrc.getStakeholdersOptions(params)
        .then(stakeholders => setStakeholdersOptionsList(stakeholders))
        .catch(error => message.log('Error al cargar listados'))
        .finally(() => setLoading(false))    
    }else{
        setStakeholdersOptionsList([])
        setProjectsOptionsList([])
        setData({})
    }    
  }, [props.showModal])
  
  
  const createManualPayment = () => {        
    if(Object.keys(data).length === 0){
        return message.warning('Debes seleccionar un Cliente')
    }

    if(data.project_id === null){
        return message.warning('Debes seleccionar un proyecto')
    }    
    if(!parseFloat(data.total_amount)){
        return message.warning('Debes Ingresar un monto mayor a 0')
    }
    data.total_amount = parseFloat(data.total_amount)
    
    setLoading(true)
    PaymentsSrc.createManualPayment(data).then(_=>{
        message.success("Recibo creado")        
    }).catch(error=> {
        console.log(error); message.error('No se ha podido crear el recibo')
    }).finally(()=>{setLoading(false);props.hideModal()})
        
  }

  const handleSearchStakeholder = useCallback(
    (stakeholder_name, additionalParams = {}) => {      
      if (stakeholder_name === '') return

      const params = {
        name: { $like: `%25${stakeholder_name}%25` },
        status: 'ACTIVE',
        stakeholder_type: { $ne: 'PROVIDER' },
        ...additionalParams,
      }

      setLoading(true)

      billingSrc
        .getStakeholdersOptions(params)
        .then(stakeholders => setStakeholdersOptionsList(stakeholders))
        .catch(error => console.log(error))
        .finally(() => setLoading(false))
    },
    [setLoading]
  )

  const handleSearchProject = stakeholder_id => name => {
    if (name === '' || (!stakeholder_id && name !== null)) return

    const params = {
      stakeholder_id,
      name: { $like: `%25${name || ''}%25` },
    }

    setLoading(true)

    billingSrc
      .getProjectsOptions(params)
      .then(data => setProjectsOptionsList(data))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  }

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    if (field === 'stakeholder_id') {
      handleSearchProject(value)()

      const stakeholder = stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setData(prevState => ({
        ...prevState,
        project_id: null,
        stakeholder_id: stakeholder.id,
        client_name: stakeholder.name,
        stakeholder_name: stakeholder.stakeholder_name,
        stakeholder_type: stakeholder.stakeholder_type,
        stakeholder_nit: stakeholder.nit,
        stakeholder_email: stakeholder.email,
        stakeholder_phone: stakeholder.phone,
        stakeholder_address: stakeholder.address,
        total_amount: null,
      }))
    }

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  return (    
      <Modal
          title="Nuevo Recibo"
          visible={props.showModal}
          onOk={createManualPayment}
          onCancel={props.hideModal}
          width={'850px'}
        >
            <Spin spinning={loading}>
            <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Selecciona Cliente</div>
            <Select              
              className={'single-select'}
              placeholder={'Buscar cliente'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              optionFilterProp='children'
              showSearch
              onSearch={debounce(handleSearchStakeholder, 400)}
              onChange={handleChange('stakeholder_id')}
              value={data.stakeholder_id}
            >
              {stakeholdersOptionsList?.length > 0 ? (
                stakeholdersOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={data.stakeholder_id}>
                  {data.stakeholder_name}
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>NIT</div>
            <Input
              placeholder={'Escribir NIT'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.stakeholder_nit}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              value={data.stakeholder_type}
              disabled
            >
              {props.stakeholderTypesOptionsList?.length > 0 ? (
                props.stakeholderTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='stakeholderTypes' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={data.stakeholder_type}>
                  <Tag type='stakeholderTypes' value={data.stakeholder_type} />
                </Option>
              )}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Email</div>
            <Input
              placeholder={'Escribir email'}
              size={'large'}
              type={'email'}
              style={{ height: '40px' }}
              value={data.stakeholder_email}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              placeholder={'Escribir telefono'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.stakeholder_phone}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              placeholder={'Escribir direccion'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.stakeholder_address}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Proyecto</div>
            <Select
              className={'single-select'}
              placeholder={'Proyecto'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              showSearch
              onSearch={debounce(handleSearchProject(data.stakeholder_id), 400)}
              value={data.project_id}
              onChange={handleChange('project_id')}
              loading={props.loading}
              optionFilterProp='children'              
            >
              {projectsOptionsList?.length > 0 ? (
                projectsOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={data.project_id}>{data.project_name}</Option>
              )}
            </Select>
          </Col>   
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Monto</div>
            <Input
            type='number'
              placeholder={'Monto'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.total_amount}
              onChange={handleChange('total_amount')}
            />
          </Col>
        </Row>
            </Spin>      
        </Modal>
    
  )
}
export default PaymentsCreate
