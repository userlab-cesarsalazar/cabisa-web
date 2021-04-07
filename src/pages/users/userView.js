import Reac,{useState} from 'react'
import { withRouter } from 'react-router'
import {Card, message, Spin} from 'antd'
import UsersSrc from './usersSrc'
import { Auth, Cache } from 'aws-amplify'
import '../../amplify_config'
// UI components
import HeaderPage from '../../components/HeaderPage'
import UserFields from './components/userFields'

function UserView(props) {

  const [loading,setLoading] = useState(false)

  const saveData = async (data) => {
      setLoading(true)
      try{
          //let user = `cabisa-user-${Date.now()}`
          let awsUsercreate = true //await createUserCognito(user,data.password,data.email)
          if (!awsUsercreate)
              throw 'Error on aws cognito create user'

          UsersSrc.createUser(data).then(_=>{
              message.success('Usuario creado')
              props.history.push('/users')
          }).catch(err=>{
              setLoading(false)
              console.log("ERROR ON CREATING USER",err)
              message.warning('El usuario no se ha podido crear')
          })

      }catch (err){
          setLoading(false)
          message.warning('El usuario no se ha podido crear')
      }



  }

  const createUserCognito = async (username,password,email) =>{
      try {
          const { user } = await Auth.signUp({
              username,
              password,
              attributes: {
                  email
              }
          });
          console.log("Usuario creado en cognito",user);
          return true
      } catch (error) {
          console.log('error signing up:', error);
          return false
      }
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage titleButton={'Nuevo usuario'} title={'Crear Usuario'} />
      <Card className={'card-border-radius margin-top-15'}>
        <UserFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </Spin>
  )
}
export default withRouter(UserView)
