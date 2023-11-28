import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../components/HeaderPage'
import { message, Card } from 'antd'
import BillingFields from './components/billingFields'
import billingSrc from './billingSrc'
import { showErrors, validateRole } from '../../utils'
import { Cache } from 'aws-amplify'
import {
  stakeholdersTypes,
  roles,
  documentsPaymentMethods,
} from '../../commons/types'

function BillingView() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])

  const isAdmin = validateRole(roles.ADMIN)

  useEffect(() => {
    setPaymentMethodsOptionsList([
      documentsPaymentMethods.CARD,
      documentsPaymentMethods.CASH,
    ])

    setLoading(true)

    Promise.all([
      billingSrc.getStakeholderTypes(),
      billingSrc.getServiceTypes(),
      billingSrc.getCreditDays(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[0].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setStakeholderTypesOptionsList(stakeholdersTypesList)
        setServiceTypesOptionsList(data[1])
        setCreditDaysOptionsList(data[2])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveData = async saveData => {
    let products = saveData.products
    saveData.products = products.filter(
      product =>
        product.parent_product_id === null ||
        product.parent_product_id === undefined
    )
    let billData = createBillStructure(saveData)
    
   setLoading(true)  
   //create infile DOC
  let infileDoc = await billingSrc.createInvoiceFel(billData)
  let infileMessage = infileDoc.message  
    if(infileMessage === 'SUCCESSFUL'){      
      //create info in DB
      const _serie = infileDoc.data.serie
      const _document_number = infileDoc.data.numero
      const _uuid = infileDoc.data.uuid
      saveData.serie = _serie
      saveData.document_number = _document_number
      saveData.uuid = _uuid
    billingSrc
      .createInvoice(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/billing')
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
    const {
      client_data: client,
      description: observations,
      products,
      credit_days
    } = dataBill
    let items = []
    items = products.map(product => {      
      const price = product.service_user_price || product.product_user_price
      const description =
        product.product_description || product.service_description
      const quantity = product.product_quantity
      const discount = (product.product_discount_percentage / 100) * price * quantity
      const code = product.code_product
      const type = product.service_type
      return { description, price, discount, quantity, code, type }
    })

    let newStructure = {
      client,
      invoice: {
        items,
        observations,
        created_by: UserName ? UserName.userName : 'system',
        credit_days
      },
    }
    return newStructure
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          edit={false}
          loading={loading}
          setLoading={setLoading}
          handleSaveData={handleSaveData}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          stakeholderTypesOptionsList={stakeholderTypesOptionsList}
          serviceTypesOptionsList={serviceTypesOptionsList}
          creditDaysOptionsList={creditDaysOptionsList}
          cancelLink='/billing'
          isAdmin={isAdmin}
        />
      </Card>
    </>
  )
}
export default BillingView
