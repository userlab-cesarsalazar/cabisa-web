const develop = {
  inventoryMovementUrl:
    'https://4gm7sd0soe.execute-api.us-east-1.amazonaws.com/dev/inventory-movements',
  invoiceUrl:
    'https://auf9sd3ft5.execute-api.us-east-1.amazonaws.com/dev/invoices',
  productUrl:
    'https://pgs3yitu93.execute-api.us-east-1.amazonaws.com/dev/products',
  projectUrl:
    'https://ekxeyrhvhh.execute-api.us-east-1.amazonaws.com/dev/projects',
  purchaseUrl:
    'https://ezx8vhace8.execute-api.us-east-1.amazonaws.com/dev/purchases',
  saleUrl: 'https://v8z8ctg7ta.execute-api.us-east-1.amazonaws.com/dev/sales',
  serviceUrl:
    'https://ac5n79hsk1.execute-api.us-east-1.amazonaws.com/dev/services',
  stakeholderUrl:
    'https://v5xx70s4r6.execute-api.us-east-1.amazonaws.com/dev/stakeholders',
  usersUrl: 'https://oj41d9rbdi.execute-api.us-east-1.amazonaws.com/dev/users',
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
