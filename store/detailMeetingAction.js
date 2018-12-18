import axios from '../config/axios';

export function fetchMeetingDetail(meetingId) {
    return (dispatch) => {
        dispatch({type: 'FETCH_DETAIL_LOADING'});
        axios.get(`meetings/${meetingId}`)
            .then(({ data }) => {
                console.log('meeting detail', data);
                dispatch({type: 'FETCH_DETAIL_SUCCESS', payload: data});
            })
            .catch((err) => {
                console.log('Fetch Meeting Detail Error: ', err);
                dispatch({type: 'FETCH_DETAIL_ERROR', payload: err});
            });
    };
};