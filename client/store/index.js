import { createStore, applyMiddleware } from 'redux';
import primaryReducer from './primaryReducer';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'

// create the Redux store with a combination Reducer that has specialized Reducers
// also includes the redux-devtools-extension, thunk middleware, redux logger
// also includes axios support in reducers
const store = createStore(
  primaryReducer,
  composeWithDevTools(
      applyMiddleware(
        thunkMiddleware.withExtraArgument({axios}),
        createLogger()
      )
  )
);

export default store;