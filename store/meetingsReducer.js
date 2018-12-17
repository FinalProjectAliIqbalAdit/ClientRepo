const initialState = {
    loading : false,
    error : null,
    meetings : [],
    defaultMeetings: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case 'FETCH_MEETINGS_CALL':
        return { ...state, loading : true }

    case 'FETCH_MEETINGS_COMPLETE':
        return { ...state, loading : false, meetings : payload, defaultMeetings: payload }

    case 'FETCH_MEETINGS_ERROR':
        return { ...state, loading : false, error : payload }

    case 'SET_MEETINGS':
        return {
            ...state,
            loading: false,
            meetings: [...payload]
        }
    case 'SET_MEETINGS_DEFAULT':
        return {
            ...state,
            loading: false,
            meetings: [...state.defaultMeetings]
        }

    default:
        return state
        
  }
}
