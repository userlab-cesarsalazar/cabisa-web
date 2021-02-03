import Users from '../pages/users/usersIndex'
import Clients from '../pages/clients/clientsIndex'
import Generic from '../pages/genericPage'
import Sales from '../pages/sales/salesIndex'
import UsersView from '../pages/users/userView'
import ClientView from '../pages/clients/clientView'

const menu_routes = [
  {
    name: 'Usuarios',
    key: 'users',
    icon: 'users',
    route: '/users',
    component: Users,
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
    component: Clients,
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
    component: Sales,
    profilePermissions: [53],
    routeGroup: [
      /^(\/sales)|(\/sales\/)|(\/salesView)|(\/salesView\/)|(\/salesView\/[a-zA-z0-9]*)/i,
    ],
  },
  {
    name: 'Inventario',
    key: 'inventory',
    icon: 'products',
    route: '/inventory',
    component: Generic,
    profilePermissions: [25],
  },
  {
    name: 'Facturacion',
    key: 'shops',
    icon: 'inventory',
    route: '/shops',
    component: Generic,
    profilePermissions: [9],
  },
  {
    name: 'Reportes',
    key: 'cash-register',
    icon: 'cashRegister',
    route: '/cash-register',
    component: Generic,
    profilePermissions: [53],
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
]
export { menu_routes, menu_sub_routes }
