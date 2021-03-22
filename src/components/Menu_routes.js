import Users from '../pages/users/usersIndex'
import Clients from '../pages/clients/clientsIndex'
import Sales from '../pages/sales/salesIndex'
import UsersView from '../pages/users/userView'
import ClientView from '../pages/clients/clientView'
import ServiceNoteView from '../pages/sales/components/serviceNote/serviceNoteView'
import Inventory from '../pages/inventory/inventoryIndex'
import InventoryView from '../pages/inventory/inventoryView'

//Reports
import ReportMachine from '../pages/reports/reportMachine/reportMachineIndex'
import ReportInventory from '../pages/reports/reportInventory/reportInventoryIndex'
import ReportClient from '../pages/reports/reportClient/reportClientIndex'
import ReportAccountsReceivable from '../pages/reports/reportAccountsReceivable/reportAccountsReceivableIndex'

//billing
import Billing from '../pages/billing/billingIndex'
import BillingView from '../pages/billing/billingView'

import genericPage from '../pages/genericPage'

import { report_sections } from './report_sections'

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
    routeGroup: [/^(\/sales)|(\/sales\/)|(\/serviceNoteView)/i],
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
      /^(\/reportInventory)|(\/reportAccountsReceivable)|(\/reportAccountClient)|(\/reportEquipmentService)|(\/reportMachineHistory)|(\/reportMonthlyBill)|(\/reportShipping)|(\/reportSales)|(\/reportCommissions)|(\/reportCostSellingEquipment)/i,
    ],
    sub_menu: report_sections,
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
    route: '/serviceNoteView',
    component: ServiceNoteView,
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
    route: '/inventoryView/warehouse',
    component: InventoryView,
  },
  {
    route: '/billing',
    component: Billing,
  },
  {
    route: '/billingView',
    component: BillingView,
  },
  {
    route: '/reportMachineHistory',
    component: ReportMachine,
  },
  {
    route: '/reportInventory',
    component: ReportInventory,
  },
  {
    route: '/reportAccountClient',
    component: ReportClient,
  },
  {
    route: '/reportAccountsReceivable',
    component: ReportAccountsReceivable,
  },
  {
    route: '/reportEquipmentService',
    component: genericPage,
  },
  {
    route: '/reportMonthlyBill',
    component: genericPage,
  },
  {
    route: '/reportShipping',
    component: genericPage,
  },
  {
    route: '/reportSales',
    component: genericPage,
  },
  {
    route: '/reportCommissions',
    component: genericPage,
  },
  {
    route: '/reportCostSellingEquipment',
    component: genericPage,
  },
]
export { menu_routes, menu_sub_routes }
