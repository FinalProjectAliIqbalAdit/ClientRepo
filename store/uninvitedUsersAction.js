import axios from '../config/axios';

export function fetchUninvitedUsers(meetingId, token) {
    console.log('ini meetingId:',meetingId);
    console.log('ini token:',token);

    return (dispatch) => {
        dispatch({type: 'FETCH_UNINVITED_LOADING'});
        axios.get(`/meetings/userstoinvite/${meetingId}`, {headers: {
            token: token
        }})
            .then(({ data }) => {
                console.log('uninvited users: ', data);
                dispatch({type: 'FETCH_UNINVITED_SUCCESS', payload: data});
            })
            .catch((err) => {
                console.log('Get Uninvited Users Error: ', err.response);
                dispatch({type: 'FETCH_UNINVITED_ERROR', payload: err.response});
            });
    }
}

export function setUninvited(filteredUsers) {
    return {type: 'SET_UNINVITED', payload: filteredUsers};
};

export function setUninvitedToDefault() {
    return {type: 'SET_UNINVITED_DEFAULT'};
};