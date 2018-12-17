import axios from '../config/axios'
import { NavigationActions } from 'react-navigation';


export default function(email, password, history) {

    return (dispatch) => {

        dispatch({type : 'LOGIN_CALL'})

        axios.post('/login', {
            email,password
        })
            .then((result) => {
                dispatch({type : 'LOGIN_SUCCESS', payload : result.data.user})
                console.log('bal',result.data)
                NavigationActions.navigate('Meetings')

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