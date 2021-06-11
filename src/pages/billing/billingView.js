import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../components/HeaderPage'
import { message, Card } from 'antd'
import BillingFields from './components/billingFields'
import FooterButtons from '../../components/FooterButtons'
import billingSrc from './billingSrc'
import { showErrors, roundNumber } from '../../utils'
import { stakeholdersTypes } from '../../commons/types'
import { useEditableList } from '../../hooks'

function BillingView(props) {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])
  const [projectsOptionsList, setProjectsOptionsList] = useState([])
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])
  const [data, setData] = useState([])
  const [productsData, setProductsData] = useState([])
  const [discountInputValue, setDiscountInputValue] = useState(0)

  useEffect(() => {
    setLoading(true)

    Promise.all([
      billingSrc.getPaymentMethods(),
      billingSrc.getStakeholderTypes(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[1].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setPaymentMethodsOptionsList(data[0])
        setStakeholderTypesOptionsList(stakeholdersTypesList)
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setData(prevState => {
      const totals = productsData.reduce((r, p) => {
        const discount = (r.discount || 0) + p.unit_discount * p.quantity
        const subtotal = (r.subtotal || 0) + p.unit_price * p.quantity
        const total_tax = (r.total_tax || 0) + p.unit_tax_amount * p.quantity
        const total = subtotal + total_tax

        return {
          discount: roundNumber(discount) || 0,
          subtotal: roundNumber(subtotal) || 0,
          total_tax: roundNumber(total_tax) || 0,
          total: roundNumber(total) || 0,
        }
      }, {})

      return { ...prevState, ...totals }
    })
  }, [setData, productsData])

  const getPercent = number => {
    const tax_fee = Number(number)
    return !isNaN(tax_fee) && tax_fee > 0 ? tax_fee / 100 : 0
  }

  const updateInvoiceTotals = (field, value, rowIndex) => {
    const getProductSubtotal = (field, value, row, unit_discount) => {
      if (field === 'unit_price')
        return roundNumber(row.quantity * (value - unit_discount))

      if (field === 'quantity')
        return roundNumber(value * (row.unit_price - unit_discount))

      return 0
    }

    const product = productsOptionsList.find(option => option.id === value)

    setProductsData(prevState => {
      const row = prevState[rowIndex]
      const baseUnitPrice = product ? product.unit_price : row.base_unit_price
      const tax_fee = product ? product.tax_fee : row.tax_fee
      const unit_discount = baseUnitPrice * getPercent(discountInputValue)
      const unit_price = baseUnitPrice - unit_discount

      const newRow = {
        ...row,
        id: product ? product.id : row.id,
        code: product ? product.code : row.code,
        tax_fee,
        base_unit_price: row.base_unit_price || unit_price,
        unit_price: roundNumber(unit_price),
        unit_tax_amount: roundNumber(unit_price * getPercent(tax_fee)),
        unit_discount: roundNumber(unit_discount),
        subtotal: getProductSubtotal(field, value, row, unit_discount),
      }

      return prevState.map((prevRow, index) =>
        index === rowIndex ? newRow : prevRow
      )
    })
  }

  const editableList = useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: {
      id: '',
      code: '',
      quantity: 0,
      tax_fee: 12,
      unit_price: 0,
      base_unit_price: 0,
      unit_tax_amount: 0,
      subtotal: 0,
    },
    onChange: updateInvoiceTotals,
  })

  const handleDiscountChange = e => {
    setDiscountInputValue(e.target.value)

    setProductsData(prevState =>
      prevState.map(p => {
        const unit_discount = p.base_unit_price * getPercent(e.target.value)
        const unit_price = p.base_unit_price - unit_discount
        const unit_tax_amount = unit_price * getPercent(p.tax_fee)
        const subtotal = p.quantity * unit_price

        return {
          ...p,
          unit_price: roundNumber(unit_price),
          unit_discount: roundNumber(unit_discount),
          unit_tax_amount: roundNumber(unit_tax_amount),
          subtotal: roundNumber(subtotal),
        }
      })
    )
  }

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    if (field === 'stakeholder_id') {
      const stakeholder = stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setData(prevState => ({
        ...prevState,
        stakeholder_id: stakeholder.id,
        stakeholder_name: stakeholder.stakeholder_name,
        stakeholder_type: stakeholder.stakeholder_type,
        stakeholder_nit: stakeholder.nit,
        stakeholder_email: stakeholder.email,
        stakeholder_phone: stakeholder.phone,
        stakeholder_address: stakeholder.address,
      }))
    }

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const getSaveData = () => ({
    stakeholder_id: data.stakeholder_id,
    project_id: data.project_id,
    payment_method: data.payment_method,
    products: productsData.map(p => ({
      product_id: p.id,
      product_quantity: p.quantity,
      product_price: p.unit_price,
      product_discount_percentage: discountInputValue,
      product_discount: p.unit_discount,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'payment_method', value: 'Metodo de pago' },
      { key: 'project_id', value: 'Proyecto' },
    ]
    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )
    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }
    const productsRequiredFields = [
      'product_id',
      'product_quantity',
      'product_price',
    ]

    const productRequiredPositions = data.products.flatMap((p, i) =>
      productsRequiredFields.some(k => !p[k]) ? i + 1 : []
    )
    if (productRequiredPositions.length > 0) {
      productRequiredPositions.forEach(p => {
        errors.push(`Todos los campos del producto ${p} son obligatorios`)
      })
    }
    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }

  const saveData = () => {
    const saveData = getSaveData()

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)

    setLoading(true)

    billingSrc
      .createInvoice(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/billing')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const handleSearchStakeholder = stakeholder_name => {
    if (stakeholder_name === '') return

    const params = {
      name: { $like: `%25${stakeholder_name}%25` },
    }

    setLoading(true)

    billingSrc
      .getStakeholdersOptions(params)
      .then(stakeholders => setStakeholdersOptionsList(stakeholders))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const handleSearchProduct = description => {
    if (description === '') return

    const params = {
      stock: { $gt: 0 },
      description: { $like: `%25${description}%25` },
    }

    setLoading(true)

    billingSrc
      .getProductsOptions(params)
      .then(data => setProductsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const handleSearchProject = name => {
    if (name === '') return

    const params = { name: { $like: `%25${name}%25` } }

    setLoading(true)

    billingSrc
      .getProjectsOptions(params)
      .then(data => setProjectsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          edit={false}
          loading={loading}
          setLoading={setLoading}
          data={data}
          productsData={productsData}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          stakeholderTypesOptionsList={stakeholderTypesOptionsList}
          discountInputValue={discountInputValue}
          handleDiscountChange={handleDiscountChange}
          handleChange={handleChange}
          stakeholdersOptionsList={stakeholdersOptionsList}
          handleSearchStakeholder={handleSearchStakeholder}
          productsOptionsList={productsOptionsList}
          handleSearchProduct={handleSearchProduct}
          projectsOptionsList={projectsOptionsList}
          handleSearchProject={handleSearchProject}
          editableList={editableList}
        />
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={props.edit}
          cancelLink='/billing'
        />
      </Card>
    </>
  )
}
export default BillingView
