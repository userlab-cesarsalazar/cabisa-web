import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Spin, message, Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import billingSrc from '../../../billing/billingSrc'
import saleSrc from '../../salesSrc'
import BillingFieldsTwo from '../../../billing/components/billingFieldsTwo'
import { showErrors } from '../../../../utils'
import { getDetailData } from '../../../billing/billingIndex'
import { documentsPaymentMethods } from '../../../../commons/types'
import { Cache } from 'aws-amplify'

function ServiceNoteBill() {
  const location = useLocation()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])

  useEffect(() => {
    setPaymentMethodsOptionsList([
      documentsPaymentMethods.CARD,
      documentsPaymentMethods.CASH,
    ])

    setLoading(true)

    Promise.all([billingSrc.getServiceTypes(), billingSrc.getCreditDays()])
      .then(data => {
        setServiceTypesOptionsList(data[0])
        setCreditDaysOptionsList(data[1])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [location])

  const handleSaveData = async saveData => {   
  let billData =  createBillStructure(saveData)            
   setLoading(true)
  
  let infileDoc = await billingSrc.createInvoiceFel(billData)
    
  let infileMessage = infileDoc.message  
    
  if(infileMessage === 'SUCCESSFUL'){      
      const _serie = infileDoc.data.serie
      const _document_number = infileDoc.data.numero
      const _uuid = infileDoc.data.uuid
      saveData.serie = _serie
      saveData.document_number = _document_number
      saveData.uuid = _uuid    
      setLoading(true)
    
    saleSrc
      .approveSale(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/sales')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))

    }else{      
      setLoading(false)
      message.error(infileMessage)
    }
        
  }

  const createBillStructure = dataBill => {
    const UserName = Cache.getItem('currentSession')
    const { client_data: client, description: observations, products } = dataBill;
    let items = [];
    items = products.map(product => {
       const price = (product.service_user_price || product.product_user_price)
       const description = product.product_description || product.service_description       
       const quantity = product.product_quantity
       const discount = ((product.product_discount_percentage/100) * price) * quantity
       return { description, price,discount,quantity}
    })
    
    let newStructure = {
       client,
       "invoice":{
          items,      
          observations,
          created_by: UserName ? UserName.userName : 'system'
       }
    }
    return newStructure
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFieldsTwo
          isInvoiceFromSale
          edit={false}
          loading={loading}
          editData={getDetailData(location.state)}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          serviceTypesOptionsList={serviceTypesOptionsList}
          creditDaysOptionsList={creditDaysOptionsList}
          cancelLink='/sales'
          handleSaveData={handleSaveData}
        />
      </Card>
    </Spin>
  )
}
export default ServiceNoteBill
