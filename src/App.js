import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { hideAlertMessage } from "./redux/actions/ui";
import { dispatchMsg } from "./redux/actions/toDo";
import Page from "./components/Page";
import F4 from "./components/pages/f4";
import {withAlert} from "react-alert";




class App extends Component {

  componentDidMount() {
    console.log('channel', this.props.channel)
    console.log('app prosp!!!!!s   !', this)

    this.props.channel.on("server_msg", msg => {
      console.log('new msg', msg)
      this.props.dispatchMsg(msg)
      // let messageItem = document.createElement("li")
      // messageItem.innerText = `[${Date()}] ${payload.body}`
      // messagesContainer.appendChild(messageItem)
    })


//     let socket = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}})
//     socket.connect()
//
// // Now that you are connected, you can join channels with a topic:
//     let channel           = socket.channel("room:lobby", {})
// // let chatInput         = document.querySelector("#chat-input")
// // let messagesContainer = document.querySelector("#messages")
//
// // chatInput.addEventListener("keypress", event => {
// //     if(event.keyCode === 13){
// //         channel.push("new_msg", {body: chatInput.value})
// //         chatInput.value = ""
// //     }
// // })
//

//
//     channel.join()
//         .receive("ok", resp => { console.log("Joined successfully", resp) })
//         .receive("error", resp => { console.log("Unable to join", resp) })

  }

  componentDidUpdate(){
    if (this.props.ui.alert.show && this.props.ui.alert.msg) {
      this.props.alert.show(this.props.ui.alert.msg, {
        type: this.props.ui.alert.type,
        timeout: 1750,
      })
      this.props.hideAlertMessage()
    }
  }

  render() {
    return (
      <div className="App">
        <Page channel={this.props.channel}>
          <F4 />
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});
const mapDispatchToProps = dispatch => ({
  hideAlertMessage: () => dispatch(hideAlertMessage()),
  dispatchMsg: (msg) => dispatch(dispatchMsg(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(App));