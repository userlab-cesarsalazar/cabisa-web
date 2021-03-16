import Amplify from 'aws-amplify'

export default Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_buevGtRrC',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '7ad850d8p7s7te7svgjp34fsgj',
    identityPoolId: 'us-east-1:cbed129f-00a6-4b29-ac05-5671694ae887',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
})
