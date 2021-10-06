// import React from 'react'
import { Tag as AntTag } from 'antd'

const config = {
  creditStatus: {
    UNPAID: { color: 'cyan', text: 'Pago Pendiete' },
    PAID: { color: '#87d068', text: 'Pagado' },
    DEFAULT: { color: '#f50', text: 'En Mora' },
  },
  documentsServiceType: {
    PART: { color: 'geekblue', text: 'Repuesto' },
    EQUIPMENT: { color: 'green', text: 'Equipo' },
    SERVICE: { color: 'cyan', text: 'Servicio' },
  },
  documentStatus: {
    APPROVED: { color: '#87d068', text: 'Aprobado' },
    CANCELLED: { color: '#f50', text: 'Anulado' },
    PENDING: { color: 'grey', text: 'Pendiente' },
  },
  documentsPaymentMethods: {
    CARD: { color: 'geekblue', text: 'Tarjeta debito/credito' },
    CASH: { color: 'green', text: 'Efectivo' },
    CHECK: { color: '#f50', text: 'Cheque' },
    DEPOSIT: { color: 'grey', text: 'Deposito' },
    TRANSFER: { color: 'cyan', text: 'Transferencia' },
  },
  inventoryMovementsStatus: {
    PENDING: { color: 'grey', text: 'Pendiente' },
    PARTIAL: { color: 'cyan', text: 'Parcial' },
    CANCELLED: { color: '#f50', text: 'Cancelado' },
    APPROVED: { color: '#87d068', text: 'Aprobado' },
  },
  inventoryMovementsTypes: {
    OUT: { color: '#f50', text: 'Egreso' },
    IN: { color: '#87d068', text: 'Ingreso' },
  },
  operationsTypes: {
    INVENTORY_ADJUSTMENT: { color: 'geekblue', text: 'Ajuste de Inventario' },
    SELL: { color: 'green', text: 'Venta' },
    PURCHASE: { color: 'cyan', text: 'Compra' },
    RENT: { color: '#87d068', text: 'Servicio' },
    REPAIR: { color: 'grey', text: 'Reparacion' },
  },
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
  roles: {
    ADMIN: { color: '#187fce', text: 'Administrador' },
    SELLS: { color: '#87d067', text: 'Vendedor' },
    WAREHOUSE: { color: '#f50', text: 'Bodega' },
    OPERATOR: { color: '#fec842', text: 'Operador' },
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
