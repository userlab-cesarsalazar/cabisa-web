export const documentsTypes = {
  PURCHASE_ORDER: 'PURCHASE_ORDER',
  SELL_PRE_INVOICE: 'SELL_PRE_INVOICE',
  SELL_INVOICE: 'SELL_INVOICE',
  RENT_PRE_INVOICE: 'RENT_PRE_INVOICE',
  RENT_INVOICE: 'RENT_INVOICE',
}

export const documentsServiceType = {
  MACHINERY: 'MACHINERY',
  EQUIPMENT: 'EQUIPMENT',
  SERVICE: 'SERVICE',
}

export const documentsStatus = {
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  APPROVED: 'APPROVED',
}

export const documentsPaymentMethods = {
  CARD: 'CARD',
  CASH: 'CASH',
  CHECK: 'CHECK',
  DEPOSIT: 'DEPOSIT',
  TRANSFER: 'TRANSFER',
}

export const inventoryMovementsStatus = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  CANCELLED: 'CANCELLED',
  APPROVED: 'APPROVED',
}

export const inventoryMovementsTypes = {
  IN: 'IN',
  OUT: 'OUT',
}

export const operationsTypes = {
  SELL: 'SELL',
  PURCHASE: 'PURCHASE',
  RENT: 'RENT',
}

export const productsCategories = {
  EQUIPMENT: 'EQUIPMENT',
  PART: 'PART',
}

// also apply to serviceStatus
export const productsStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
}

export const productsTypes = {
  SERVICE: 'SERVICE',
  PRODUCT: 'PRODUCT',
}

export const productsTaxes = {
  IVA: 1,
  EXENTO: 2,
}

export const projectsStatus = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  FINISHED: 'FINISHED',
}

export const stakeholdersStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
}

export const stakeholdersTypes = {
  CLIENT_INDIVIDUAL: 'CLIENT_INDIVIDUAL',
  CLIENT_COMPANY: 'CLIENT_COMPANY',
  PROVIDER: 'PROVIDER',
}

export const usersStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
}

// ROLES AND PERMISSIONS
// sigue el formato { name: id }
export const roles = {
  ADMIN: 1,
  SELLS: 2,
  WAREHOUSE: 3,
  OPERATOR: 4,
}

export const rolesStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}

export const permissions = {
  CONFIGURACION_GENERAL: 1,
  USUARIOS: 2,
  REPORTES: 3,
  FACTURACION: 4,
  INVENTARIO: 5,
  VENTAS: 6,
  CLIENTES: 7,
}

export const actions = {
  CREATE: 'create',
  DELETE: 'delete',
  EDIT: 'edit',
  VIEW: 'view',
}
