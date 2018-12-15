import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk'

import meetings from './meetingsReducer.js'
import login from './loginReducer.js'


const rootReducers = combineReducers({
    login,
    meetings
})

const logger = store => next => action => {
    console.log('this is action --- ', action)
    console.log('current dispatch --', store.getState() )
    next(action)
}

const store = createStore(rootReducers, compose(applyMiddleware(thunk, logger)))

export default store
