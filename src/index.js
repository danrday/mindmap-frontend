import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { Provider } from "react-redux";
import configureStore from "./redux/store";

const {store, doc_channel} = configureStore()

const alertOptions = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE,
    containerStyle: {
        zIndex: 5000
    }
}

ReactDOM.render(
  <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App channel={doc_channel} style={{width: '100%', height: '100%'}}/>
      </AlertProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
