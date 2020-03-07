import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from 'redux-logger'
import rootReducer from "./reducers/rootReducer";

//TODO comment out for PRODUCTION
import { composeWithDevTools } from "redux-devtools-extension";
export default function configureStore(initialState = {}) {
  // const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, createLogger()))(
  const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk))(
    createStore
  );

  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
}
