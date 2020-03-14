import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from 'redux-logger'
import rootReducer from "./reducers/rootReducer";


//TODO comment out for PRODUCTION
import { composeWithDevTools } from "redux-devtools-extension";
import {Socket} from "phoenix";
export default function configureStore(initialState = {}, ) {
  // const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, createLogger()))(
  // const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, test))(
  const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk, test))(
    createStore
  );

  const store = createStoreWithMiddleware(rootReducer, initialState);

  let socket = new Socket(`ws://${process.env.REACT_APP_HOST}:4000/socket`, {params: {token: window.userToken}})
  socket.connect()

// Now that you are connected, you can join channels with a topic:
  let  channel           = socket.channel("room:lobby", {})

  function test(store) {
    return function hi(next) {
      return function ho(action) {
        console.log('dispatching', action)

        // if action is coming from the server or it's one of the initializer actions'
        if (action.server_msg || action.type === "file/FETCH_FILE"
            || action.type === "file/UPDATE_FILE"
            || action.type === "file/FETCH_FILE_RECEIVED"
            || action.type === "globalEdit/POPULATE_INITIAL_VALUES") {
          let result = next(action)
          console.log('next state??????', store.getState())
          return result
        }
        else {
          channel.push("new_msg", {type: action.type, payload: action.payload})
          return
        }
      }
    }
  }


// let chatInput         = document.querySelector("#chat-input")
// let messagesContainer = document.querySelector("#messages")

// chatInput.addEventListener("keypress", event => {
//     if(event.keyCode === 13){
//         channel.push("new_msg", {body: chatInput.value})
//         chatInput.value = ""
//     }
// })
//
//   channel.on("server_msg", server_msg => {
//     // console.log('server_msg', server_msg)
//
//     store.dispatch((msg) => {
//       console.log('msg', msg)
//       console.log('server_msg', server_msg)
//
//       return {
//         type: server_msg.body.type,
//         payload: "AAAAAH",
//         server_msg: true
//       }
//     })
//     // let messageItem = document.createElement("li")
//     // messageItem.innerText = `[${Date()}] ${payload.body}`
//     // messagesContainer.appendChild(messageItem)
//   })

  channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

window.channel = channel



  return {store, channel};
}


