import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'

import meetings from './meetingsReducer.js'
import login from './loginReducer.js'
import uninvitedUsers from './uninvitedUsersReducer.js'
import detailMeeting from './detailMeetingReducer.js'


const rootReducers = combineReducers({
    login,
    meetings,
    uninvitedUsers,
    detailMeeting
})

const logger = store => next => action => {
    next(action)
}

const store = createStore(rootReducers, compose(applyMiddleware(thunk, logger)))

export default store
