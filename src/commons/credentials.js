const develop = {
  clientsUrl:
    'https://z8whyqlcgl.execute-api.us-east-1.amazonaws.com/dev/clients',
  usersUrl: 'https://oj41d9rbdi.execute-api.us-east-1.amazonaws.com/dev/users',
  inventoryUrl:
    'https://gnemhrle04.execute-api.us-east-1.amazonaws.com/dev/products',
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
