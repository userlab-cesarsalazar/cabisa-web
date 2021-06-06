// import React from 'react'
import { Tag as AntTag } from 'antd'

const config = {
  productStatus: {
    // also apply to serviceStatus
    ACTIVE: { color: '#87d068', text: 'Activo' },
    INACTIVE: { color: '#f50', text: 'Inactivo' },
    BLOCKED: { color: 'grey', text: 'Bloqueado' },
  },
  productCategories: {
    EQUIPMENT: { color: 'blue', text: 'Equipo' },
    PART: { color: 'orange', text: 'Repuesto' },
  },
  documentStatus: {
    APPROVED: { color: '#87d068', text: 'Aprobado' },
    CANCELLED: { color: '#f50', text: 'Anulado' },
    PENDING: { color: 'grey', text: 'Pendiente' },
  },
  documentsPaymentMethods: {
    CARD: { color: 'geekblue', text: 'Tarjeta debito/credito' },
    CASH: { color: 'green', text: 'Efectivo' },
    TRANSFER: { color: 'cyan', text: 'Transferencia' },
  },
  stakeholderTypes: {
    CLIENT_INDIVIDUAL: { color: 'geekblue', text: 'Cliente individual' },
    CLIENT_COMPANY: { color: 'green', text: 'Cliente empresa' },
    PROVIDER: { color: 'cyan', text: 'Proveedor' },
  },
}
const Tag = ({ type, value }) => {
  const tag = config[type][value]

  return <AntTag color={tag?.color}>{tag?.text}</AntTag>
}

export default Tag
