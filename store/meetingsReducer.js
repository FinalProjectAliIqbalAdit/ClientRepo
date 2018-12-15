const initialState = {
    loading : false,
    error : null,
    meetings : [
        {
            "lat": "-6.2607",
            "lng": "106.7816",
            "participants": [
                {
                    "avatar": "",
                    "lat": "-6.1753924",
                    "lng": "106.8249641",
                    "_id": "5c10b896a556f83576399c4f",
                    "name": "user2",
                    "email": "user2@mail.com"
                }
            ],
            "status": "upcoming",
            "_id": "5c10b8aaa556f83576399c50",
            "title": "First Meeting",
            "description": "Ga boleh telat",
            "host": {
                "avatar": "",
                "lat": "-6.1753924",
                "lng": "106.8249641",
                "_id": "5c10b86aa556f83576399c4e",
                "name": "user1",
                "email": "user1@mail.com"
            },
            "startAt": "2018-12-12T17:00:00.000Z",
            "createdAt": "2018-12-12T07:28:42.701Z",
            "updatedAt": "2018-12-12T07:51:23.134Z"
        }
    ]
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
