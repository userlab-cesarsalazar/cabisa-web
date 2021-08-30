import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Col, Divider, Input, Row, Spin, message } from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import InventoryMovementProductsList from '../../../../components/InventoryMovementProductsList'
import { showErrors } from '../../../../utils'
import {
  productsStatus,
  productsTypes,
  appConfig,
} from '../../../../commons/types'
import { useEditableList } from '../../../../hooks'
import inventorySrc from '../../inventorySrc'

const { TextArea } = Input

function InventoryAdjustmentFields({ forbidEdition, editData, ...props }) {
  const history = useHistory()
  const [loading, setLoading] = useState([])
  const [data, setData] = useState([])
  const [productsData, setProductsData] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])

  useEffect(() => {
    if (!forbidEdition) {
      handleSearchProduct(null, {
        $limit: appConfig.selectsInitLimit,
        description: { $like: '%25%25' },
      })
    }

    if (!editData) return

    const productsData = editData.products

    setData(editData)
    setProductsData(productsData)

    return () => {
      setData([])
      setProductsData([])
    }
  }, [editData, forbidEdition])

  const setProductData = (field, value, rowIndex) => {
    if (field !== 'id') return

    const product = productsOptionsList.find(option => option.id === value)

    setProductsData(prevState => {
      const newRow = {
        ...prevState[rowIndex],
        id: product.id,
        code: product.code,
        preview_stock: product.stock,
      }

      return prevState.map((row, index) => (index === rowIndex ? newRow : row))
    })
  }

  const {
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
    handleChange: handleChangeDetail,
  } = useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: {
      code: '',
      description: '',
      preview_stock: 0,
      next_stock: 0,
    },
    onChange: setProductData,
  })

  const handleSearchProduct = (product_description, additionalParams = {}) => {
    if (product_description === '') return

    const params = {
      description: { $like: `%25${product_description}%25` },
      status: productsStatus.ACTIVE,
      product_type: { $ne: productsTypes.SERVICE },
      ...additionalParams,
    }

    setLoading('productsOptionsList')

    inventorySrc
      .getProductsOptions(params)
      .then(products => setProductsOptionsList(products))
      .catch(error => showErrors(error))
      .finally(() => setLoading(null))
  }

  const getSaveData = () => ({
    adjustment_reason: data.adjustment_reason,
    products: productsData.map(p => ({
      product_id: p.id,
      preview_stock: p.preview_stock,
      next_stock: Number(p.next_stock),
    })),
  })

  const validateSaveData = data => {
    const errors = []

    const productsRequiredFields = ['product_id', 'preview_stock', 'next_stock']

    const productRequiredPositions = data.products.flatMap((p, i) =>
      productsRequiredFields.some(k => (!p[k] && p[k] !== 0) || p[k] < 0)
        ? i + 1
        : []
    )

    if (productRequiredPositions.length > 0) {
      productRequiredPositions.forEach(p => {
        errors.push(
          `Los campos Precio y Cantidad del producto ${p} deben ser mayor a cero`
        )
      })
    }

    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }

  const saveData = async () => {
    try {
      const saveData = getSaveData()

      const { isInvalid, error } = validateSaveData(saveData)

      if (isInvalid) return showErrors(error)

      setLoading('createAdjustment')

      await props.saveData(saveData)

      message.success('Ajuste creado exitosamente')
      goToInventoryAdjustments()
    } catch (error) {
      showErrors(error)
    } finally {
      setLoading(null)
    }
  }

  const goToInventoryAdjustments = () => history.push('/inventoryAdjustment')

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  return (
    <Spin spinning={loading === 'createAdjustment'}>
      <div>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Motivo del ajuste</div>
            <TextArea
              rows={4}
              value={data.adjustment_reason}
              onChange={handleChange('adjustment_reason')}
              disabled={forbidEdition}
            />
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <InventoryMovementProductsList
              dataSource={productsData}
              handleAddDetail={handleAddDetail}
              handleChangeDetail={handleChangeDetail}
              handleRemoveDetail={handleRemoveDetail}
              handleSearchProduct={handleSearchProduct}
              productsOptionsList={productsOptionsList}
              loading={loading}
              forbidEdition={forbidEdition}
            />
          </Col>
        </Row>
      </div>
      {!forbidEdition && (
        <FooterButtons
          saveData={saveData}
          cancelButton={goToInventoryAdjustments}
          edit={true}
          cancelLink=''
        />
      )}
    </Spin>
  )
}

export default InventoryAdjustmentFields
