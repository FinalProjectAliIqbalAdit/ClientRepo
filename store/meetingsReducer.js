const initialState = {
    loading : false,
    error : null,
    meetings : []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case 'FETCH_MEETINGS_CALL':
        return { ...state, loading : true }

    case 'FETCH_MEETINGS_COMPLETE':
        return { ...state, loading : false, meetings : payload }

    case 'FETCH_MEETINGS_ERROR':
        return { ...state, loading : false, error : payload }

    default:
        return state
        
  }
}
