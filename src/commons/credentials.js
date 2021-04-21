const develop = {
  clientsUrl:
    'https://z8whyqlcgl.execute-api.us-east-1.amazonaws.com/dev/clients',
  usersUrl: 'https://oj41d9rbdi.execute-api.us-east-1.amazonaws.com/dev/users',
  inventoryUrl:
    'https://gnemhrle04.execute-api.us-east-1.amazonaws.com/dev/products',
  awsAccessKeyId: 'AKIA5OM7ZNT7LL7EHO5R',
  awsSecretAccessKey: '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',
  awsRegion: 'us-east-1',
  awsUserPoolId: 'us-east-1_buevGtRrC',
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
