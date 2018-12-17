const initialState = {
    loading : false,
    error : null,
    meetings : [],
    defaultMeetings: [],
    searchLoading: false,
    searchError: false,
    searchResult: []
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
    case 'SEARCH_PLACE_LOADING':
      return {
        ...state,
        searchLoading: true
      }
    case 'SEARCH_PLACE_SUCCESS':
      return {
        ...state,
        searchLoading: false,
        searchResult: payload
      }
    case 'SEARCH_PLACE_ERROR':
      return {
        ...state,
        searchLoading: false,
        searchError: true
      }
    default:
        return state
        
  }
}
