//users
import Users from '../pages/users/usersIndex'
import UsersView from '../pages/users/userView'

// Sales
import Sales from '../pages/sales/salesIndex'
import ServiceNoteView from '../pages/sales/components/serviceNote/serviceNoteView'
import ServiceNoteBill from '../pages/sales/components/serviceNote/ServiceNoteBill'

//Clients
import Clients from '../pages/clients/clientsIndex'
import ClientView from '../pages/clients/clientView'

//Inventory

import Products from '../pages/inventory/products/productIndex'
import ProductView from '../pages/inventory/products/components/productView'

import Services from '../pages/inventory/services/serviceIndex'
import ServiceView from '../pages/inventory/services/serviceVIew'

import InventoryMovement from '../pages/inventory/inventoryMovement/inventoryMovementIndex'
import InventoryMovementView from '../pages/inventory/inventoryMovement/components/inventoryMovementView'

//Reports
import ReportMachine from '../pages/reports/reportMachine/reportMachineIndex'
import ReportInventory from '../pages/reports/reportInventory/reportInventoryIndex'
import ReportClient from '../pages/reports/reportClient/reportClientIndex'
import ReportAccountsReceivable from '../pages/reports/reportAccountsReceivable/reportAccountsReceivableIndex'

//billing
import Billing from '../pages/billing/billingIndex'
import BillingView from '../pages/billing/billingView'

import genericPage from '../pages/genericPage'

import {
  submenu_sections,
  submenu_sections_inventory,
} from './submenu_sections'

//welcome
import welcomePage from '../pages/welcomePage'

const menu_routes = [
  {
    id: 0,
    name: 'Welcome',
    key: 'welcome',
    icon: 'users',
    route: '/welcome',
    profilePermissions: [5],
    routeGroup: [/^(\/welcome)|(\/welcome\/)/i],
  },
  {
    id: 2,
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
    id: 7,
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
    id: 5,
    name: 'Inventario',
    key: 'inventory',
    icon: 'products',
    route: '/inventory',
    profilePermissions: [25],
    routeGroup: [
      /^(\/inventoryMovements)|(\/InventoryMovementsView)|(\/inventoryProducts)|(\/inventoryServices)|(\/inventoryProductsView)|(\/inventoryServicesView)/i,
    ],
    sub_menu: submenu_sections_inventory,
  },
  {
    id: 6,
    name: 'Ventas',
    key: 'sales',
    icon: 'pos',
    route: '/sales',
    profilePermissions: [53],
    routeGroup: [
      /^(\/sales)|(\/sales\/)|(\/serviceNoteView)|(\/ServiceNoteBill)/i,
    ],
  },
  {
    id: 4,
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
    id: 3,
    name: 'Reportes',
    key: 'reports',
    icon: 'cashRegister',
    route: '/reports',
    profilePermissions: [53],
    routeGroup: [
      /^(\/reportInventory)|(\/reportAccountsReceivable)|(\/reportAccountClient)|(\/reportEquipmentService)|(\/reportMachineHistory)|(\/reportMonthlyBill)|(\/reportShipping)|(\/reportSales)|(\/reportCommissions)|(\/reportCostSellingEquipment)/i,
    ],
    sub_menu: submenu_sections,
  },
]

const menu_sub_routes = [
  {
    id: 2,
    route: '/users',
    component: Users,
  },
  {
    id: 2,
    route: '/userView',
    component: UsersView,
  },
  {
    id: 7,
    route: '/clients',
    component: Clients,
  },
  {
    id: 7,
    route: '/clientView',
    component: ClientView,
  },
  {
    id: 6,
    route: '/sales',
    component: Sales,
  },
  {
    id: 6,
    route: '/serviceNoteView',
    component: ServiceNoteView,
  },
  {
    id: 6,
    route: '/ServiceNoteBill',
    component: ServiceNoteBill,
  },
  {
    id: 5,
    route: '/inventoryProducts',
    component: Products,
  },
  {
    id: 5,
    route: '/inventoryProductsView',
    component: ProductView,
  },
  {
    id: 5,
    route: '/inventoryServices',
    component: Services,
  },
  {
    id: 5,
    route: '/inventoryServicesView',
    component: ServiceView,
  },
  {
    id: 5,
    route: '/inventoryMovements',
    component: InventoryMovement,
  },
  {
    id: 5,
    route: '/InventoryMovementsView',
    component: InventoryMovementView,
  },
  {
    id: 4,
    route: '/billing',
    component: Billing,
  },
  {
    id: 4,
    route: '/billingView',
    component: BillingView,
  },
  {
    id: 3,
    route: '/reportMachineHistory',
    component: ReportMachine,
  },
  {
    id: 3,
    route: '/reportInventory',
    component: ReportInventory,
  },
  {
    id: 3,
    route: '/reportAccountClient',
    component: ReportClient,
  },
  {
    id: 3,
    route: '/reportAccountsReceivable',
    component: ReportAccountsReceivable,
  },
  {
    id: 3,
    route: '/reportEquipmentService',
    component: genericPage,
  },
  {
    id: 3,
    route: '/reportMonthlyBill',
    component: genericPage,
  },
  {
    id: 3,
    route: '/reportShipping',
    component: genericPage,
  },
  {
    id: 3,
    route: '/reportSales',
    component: genericPage,
  },
  {
    id: 3,
    route: '/reportCommissions',
    component: genericPage,
  },
  {
    id: 3,
    route: '/reportCostSellingEquipment',
    component: genericPage,
  },
  {
    id: 0,
    route: '/welcome',
    component: welcomePage,
  },
]
export { menu_routes, menu_sub_routes }
