import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger }   from "redux-logger"
import thunk              from "redux-thunk"
import promise            from "redux-promise-middleware"

import reducers  from "./reducers/store";

const middleware = applyMiddleware(promise(), thunk, createLogger({
  predicate: function(){
    return process.env.NODE_ENV_REDUX_LOGGER;
  }
}));

export default createStore(reducers,middleware)
