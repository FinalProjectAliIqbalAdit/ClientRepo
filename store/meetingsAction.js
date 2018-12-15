import axios from '../config/axios'

export function fetchMeetings(payload) {
    return (dispatch) => {

        dispatch({type : 'FETCH_MEETINGS_CALL'})

        axios.get('/meetings')
            .then((result) => {
                console.log('-------------------------------------------------------------here');
                console.log(result.data);
                console.log('-------------------------------------------------------------here');
                dispatch({type : 'FETCH_MEETINGS_COMPLETE', payload : result.data})
            }).catch((err) => {
                console.log('-------------------------------------------------------------error');
                console.log(err);
                dispatch({type : 'FETCH_MEETINGS_ERROR', payload : err})                
            });

    }  
  
}

