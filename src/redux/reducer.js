import { combineReducers } from 'redux';
import {
  LOG_IN,
} from './actions';

const authInitialState = {
  loggedIn: false
}

function authReducer(state = authInitialState, action) {
  switch(action.type) {
    case LOG_IN:
      console.log("action in reducer: ", action);
      return {
        ...state,
        accessToken: JSON.parse(action.accessToken).access_token,
        loggedIn: true,
      };
      
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  // add more reducers here
})

export default rootReducer;