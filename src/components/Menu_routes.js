import Users from '../pages/users/usersIndex'
import Clients from '../pages/clients/clientsIndex'
import Generic from '../pages/genericPage'
import Sales from '../pages/sales/salesIndex'
import UsersView from '../pages/users/userView'
import ClientView from '../pages/clients/clientView'
import ShippingNoteView from '../pages/sales/components/shippingNote/shippingNoteView'
import ReceiptNoteView from '../pages/sales/components/receiptNote/receiptNoteView'

import Inventory from '../pages/inventory/inventoryIndex'
import InventoryView from '../pages/inventory/inventoryView'
import genericPage from '../pages/genericPage'

const menu_routes = [
  {
    name: 'Usuarios',
    key: 'users',
    icon: 'users',
    route: '/users',
    profilePermissions: [5],
    routeGroup: [
      /^(\/users)|(\/users\/)|(\/userView)|(\/userView\/)|(\/userView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Clientes',
    key: 'clients',
    icon: 'clients',
    route: '/clients',
    profilePermissions: [61],
    routeGroup: [
      /^(\/clients)|(\/clients\/)|(\/clientView)|(\/clientView\/)|(\/clientView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Ventas',
    key: 'sales',
    icon: 'pos',
    route: '/sales',
    profilePermissions: [53],
    routeGroup: [
      /^(\/sales)|(\/sales\/)|(\/receiptNoteView)|(\/receiptNoteView\/)|(\/receiptNoteView\/[a-zA-z0-9]*)|(\/shippingNoteView)|(\/shippingNoteView\/)|(\/shippingNoteView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Inventario',
    key: 'inventory',
    icon: 'products',
    route: '/inventory',
    profilePermissions: [25],
    routeGroup: [
      /^(\/inventory)|(\/inventory\/)|(\/inventoryView)|(\/inventoryView\/)|(\/inventoryView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Facturacion',
    key: 'billing',
    icon: 'inventory',
    route: '/billing',
    profilePermissions: [9],
    routeGroup: [
      /^(\/billing)|(\/billing\/)|(\/billingView)|(\/billingView\/)|(\/billingView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Reportes',
    key: 'reports',
    icon: 'cashRegister',
    route: '/reports',
    profilePermissions: [53],
    routeGroup: [
      /^(\/reports)|(\/reports\/)|(\/reportsView)|(\/reportsView\/)|(\/reportsView\/[a-zA-z0-9]*)/i,
    ],
  },
]

const menu_sub_routes = [
  {
    route: '/users',
    component: Users,
  },
  {
    route: '/clients',
    component: Clients,
  },
  {
    route: '/userView',
    component: UsersView,
  },
  {
    route: '/clientView',
    component: ClientView,
  },
  {
    route: '/sales',
    component: Sales,
  },
  {
    route: '/receiptNoteView',
    component: ReceiptNoteView,
  },
  {
    route: '/shippingNoteView',
    component: ShippingNoteView,
  },
  {
    route: '/inventory',
    component: Inventory,
  },
  {
    route: '/inventoryView',
    component: InventoryView,
  },
  {
    route: '/billing',
    component: genericPage,
  },
  {
    route: '/reports',
    component: genericPage,
  },
]
export { menu_routes, menu_sub_routes }
