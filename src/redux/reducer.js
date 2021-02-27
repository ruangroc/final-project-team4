import { combineReducers } from 'redux';
import {
  LOG_IN,
} from './actions';

const initialState = {
  loggedIn: false
}

function authReducer(state = initialState, action) {
  switch(action.type) {
    case LOG_IN:
      console.log("action in reducer: ", action);
      return {
        ...state,
        accessToken: action.accessToken.access_token,
        loggedIn: true,
      };
      
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  loggedIn: authReducer,
  // add more reducers here
})

export default rootReducer;