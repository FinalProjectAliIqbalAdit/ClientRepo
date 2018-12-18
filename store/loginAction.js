import axios from '../config/axios'

export default function(email, password, props) {

    return (dispatch) => {

        dispatch({type : 'LOGIN_CALL'})

        axios.post('/login', {
            email,password
        })
            .then(({ data }) => {
                const user = {
                    ...data.user, 
                    token: data.token
                }
                dispatch({type : 'LOGIN_SUCCESS', payload : user})
                props.navigation.navigate('Home');

            })
            .catch((error) => {
                dispatch({type : 'LOGIN_ERROR' , payload : error.response.data.message})
                console.log(error.response);
            });

    }
}
export function logout() {
  return (dispatch) => {
    dispatch({type : 'LOGOUT'})
  }
}