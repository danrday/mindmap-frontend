import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from 'redux-logger'
import rootReducer from "./reducers/rootReducer";



//TODO comment out for PRODUCTION
import { composeWithDevTools } from "redux-devtools-extension";
export default function configureStore(initialState = {}) {
  // const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, createLogger()))(
  const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, test))(
    createStore
  );

  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
}

function test(store) {
  return function hi(next) {
    return function ho(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}