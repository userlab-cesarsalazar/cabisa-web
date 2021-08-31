const develop = {
  inventoryMovementUrl: 'http://127.0.0.1:3010/inventory-movements',
  invoiceUrl: 'http://127.0.0.1:3020/invoices',
  productUrl: 'http://127.0.0.1:3030/products',
  projectUrl: 'http://127.0.0.1:3040/projects',
  purchaseUrl: 'http://127.0.0.1:3050/purchases',
  saleUrl: 'http://127.0.0.1:3060/sales',
  serviceUrl: 'http://127.0.0.1:3070/services',
  stakeholderUrl: 'http://127.0.0.1:3080/stakeholders',
  usersUrl: 'http://127.0.0.1:3090/users',
  repairsUrl: 'http://127.0.0.1:3100/repairs',

  // inventoryMovementUrl:
  //   'https://4gm7sd0soe.execute-api.us-east-1.amazonaws.com/dev/inventory-movements',
  // invoiceUrl:
  //   'https://auf9sd3ft5.execute-api.us-east-1.amazonaws.com/dev/invoices',
  // productUrl:
  //   'https://pgs3yitu93.execute-api.us-east-1.amazonaws.com/dev/products',
  // projectUrl:
  //   'https://ekxeyrhvhh.execute-api.us-east-1.amazonaws.com/dev/projects',
  // purchaseUrl:
  //   'https://ezx8vhace8.execute-api.us-east-1.amazonaws.com/dev/purchases',
  // saleUrl: 'https://v8z8ctg7ta.execute-api.us-east-1.amazonaws.com/dev/sales',
  // serviceUrl:
  //   'https://ac5n79hsk1.execute-api.us-east-1.amazonaws.com/dev/services',
  // stakeholderUrl:
  //   'https://v5xx70s4r6.execute-api.us-east-1.amazonaws.com/dev/stakeholders',
  // usersUrl: 'https://oj41d9rbdi.execute-api.us-east-1.amazonaws.com/dev/users',
}

const enviroment = env => {
  switch (env) {
    case 'develop':
      return develop
    default:
      return null
  }
}

module.exports = {
  stage: enviroment('develop'),
}
