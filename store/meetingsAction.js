import axios from '../config/axios'
import store from './store'
export function fetchMeetings(payload) {
    console.log('????',store.getState());
    return (dispatch) => {

        dispatch({type : 'FETCH_MEETINGS_CALL'})

        axios.get('/meetings')
            .then((result) => {
                let data = []
                let loop = result.data
                console.log('cari ini',store.getState().login.user._id);
                for(var i = 0; i < loop.length; i++){
                  console.log('woy ini participant',loop[i].participants);
                  let tmp = loop[i].participants.filter(elem => elem._id == store.getState().login.user._id)
                  if(tmp.length !== 0){
                    data.push(loop[i])
                  }
                }
                dispatch({type : 'FETCH_MEETINGS_COMPLETE', payload : data})
            }).catch((err) => {
                dispatch({type : 'FETCH_MEETINGS_ERROR', payload : err})                
            });

    }  
  
}

export function fetchUserMeetings(userId, token) {
    return (dispatch) => {
        dispatch({type: 'FETCH_MEETINGS_CALL'});
        axios.get(`/users/${userId}`, {headers: {
            token: token
        }})
            .then(({ data }) => {
                dispatch({type: 'FETCH_MEETINGS_COMPLETE', payload: data.userMeetings});
            })
            .catch((err) => {
                console.log('Fetch Meetings Error: ', err);
                dispatch({type: 'FETCH_MEETINGS_ERROR', payload: err.response.data.message});
            });
    } 
}

export function setMeetings(filteredMeetings) {
    return {type: 'SET_MEETINGS', payload: filteredMeetings};
};

export function setMeetingsToDefault() {
    return {type: 'SET_MEETINGS_DEFAULT'};
};

