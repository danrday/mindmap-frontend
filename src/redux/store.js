import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension"; //TODO comment out for PRODUCTION
import { Socket } from "phoenix";

export default function configureStore(initialState = {}) {
  const createStoreWithMiddleware = composeWithDevTools(
    applyMiddleware(thunk, channelInterceptor)
  )(createStore);
  const store = createStoreWithMiddleware(rootReducer, initialState);
  let socket = new Socket(`/socket`, { params: { token: window.userToken } });
  let doc = document.getElementById("doc");
  let data_id = doc.getAttribute("data-id");
  socket.connect();
  let lastSeenId = 0;

  let doc_channel = socket.channel("documents:" + data_id, () => {
    return { last_seen_id: lastSeenId };
  });

  function channelInterceptor(store) {
    return function(next) {
      return function(action) {
        // if action is coming from the server or it's one of the initializer actions
        if (
          action.server_msg ||
          action.type === "file/FETCH_FILE" ||
          action.type === "file/UPDATE_FILE" ||
          action.type === "file/FETCH_FILE_RECEIVED" ||
          action.type === "globalEdit/POPULATE_INITIAL_VALUES"
        ) {
          let result = next(action);
          // console.log('next state: ', store.getState())
          return result;
        } else {
          doc_channel.push("new_msg", {
            type: action.type,
            payload: action.payload
          });
        }
      };
    };
  }

  doc_channel
    .join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp);
    })
    .receive("error", resp => {
      console.log("Unable to join", resp);
    });

  return { store, doc_channel };
}
