const defaultState = {
    loading : false,
    uninvitedUsers: [],
    defaultUninvited: [],
    error : false,
    errorMessage : ''
};

export default function(state=defaultState, { type, payload }) {
    switch (type) {
        case 'FETCH_UNINVITED_LOADING': {
            return {
                ...state, 
                loading: true
            }
        }
        case 'FETCH_UNINVITED_ERROR': {
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: payload
            }
        } 
        case 'FETCH_UNINVITED_SUCCESS': {
            return {
                ...state,
                loading: false,
                uninvitedUsers: [...payload],
                defaultUninvited: [...payload]
            }
        }
        case 'SET_UNINVITED':
            return {
                ...state,
                loading: false,
                uninvitedUsers: [...payload]
            }
        case 'SET_UNINVITED_DEFAULT':
            return {
                ...state,
                loading: false,
                uninvitedUsers: [...state.defaultUninvited]
            }
        default: 
            return state   
    }
};