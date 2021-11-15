import {createStore, combineReducers, applyMiddleware} from 'redux';
import userReducer from './reducer/reducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers(
    {
        userReducer: userReducer,
    }
)

const configureStore  = () => createStore(rootReducer, applyMiddleware(thunk))

export default configureStore;