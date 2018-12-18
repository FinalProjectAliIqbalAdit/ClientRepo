const defaultState = {
    loading: false,
    error: false,
    meeting: {
        title: '',
        description: '',
        startAt: new Date(),
        place: '',
        participants: [{
            name: ''
        }],
        host: {
            name: ''
        }
    }
};

export default function(state=defaultState, { type, payload }) {
    switch(type) {
        case 'FETCH_DETAIL_LOADING': 
            return {
                ...state,
                loading: true
            }
        case 'FETCH_DETAIL_SUCCESS':
            return {
                ...state,
                loading: false,
                meeting: {
                    ...payload
                }
            }
        case 'FETCH_DETAIL_ERROR':
            return {
                ...state,
                error: true,
                loading: false
            }
        default: 
            return state
    }
};