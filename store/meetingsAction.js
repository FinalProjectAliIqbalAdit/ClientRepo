import axios from '../config/axios'
import realAxios from 'axios'
import store from './store'
export function fetchMeetings(payload) {
    return (dispatch) => {

        dispatch({type : 'FETCH_MEETINGS_CALL'})

        axios.get('/meetings')
            .then((result) => {
                let data = []
                let loop = result.data
                for(var i = 0; i < loop.length; i++){
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

export function searchPlace(str){
    return (dispatch) => {
      dispatch({type: 'SEARCH_PLACE_LOADING'});
      var arr = str.split(' ')
      var result = arr.join('%20')
      realAxios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${result}&inputtype=textquery&fields=id,photos,formatted_address,geometry,name,opening_hours,rating&locationbias=circle:50000@-6.260679,106.781613&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`)
        .then(({ data })=>{
          dispatch({ type: 'SEARCH_PLACE_SUCCESS', payload: data.candidates })
        })
        .catch((err)=>{
          dispatch({ type: 'SEARCH_PLACE_ERROR' })
        })
    }
}
