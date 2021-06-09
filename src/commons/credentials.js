const develop = {
  clientsUrl:
    'https://z8whyqlcgl.execute-api.us-east-1.amazonaws.com/dev/clients',
  usersUrl: 'https://oj41d9rbdi.execute-api.us-east-1.amazonaws.com/dev/users',
  productUrl: 'http://127.0.0.1:5500/products',
  // 'https://gnemhrle04.execute-api.us-east-1.amazonaws.com/dev/products',
  projectUrl: 'http://127.0.0.1:4000/projects',
  purchaseUrl: 'http://127.0.0.1:3000/purchases',
  saleUrl: 'http://127.0.0.1:4000/sales',
  serviceUrl: 'http://127.0.0.1:3000/services',
  stakeholderUrl: 'http://127.0.0.1:5000/stakeholders',
  invoiceUrl: 'http://127.0.0.1:3000/invoices',
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
