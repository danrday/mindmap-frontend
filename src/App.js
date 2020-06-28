import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { hideAlertMessage } from "./redux/actions/ui";
import { dispatchMsg } from "./redux/actions/channel";
import { getUser } from "./redux/actions/user";
import Shell from "./components/Shell";
import F4 from "./components/forceGraph/f4";
import { withAlert } from "react-alert";

class App extends Component {
  componentDidMount() {
    // *****get user_info from channel on mount, set it in the store
    this.props.getUser(this.props.channel);

    // LISTEN FOR ACTIONS FROM THE PHOENIX SERVER
    this.props.channel.on("server_msg", msg => {
      // console.log("server msg", msg);
      this.props.dispatchMsg(msg);
    });
  }
  componentDidUpdate() {
    if (this.props.ui.alert.show && this.props.ui.alert.msg) {
      this.props.alert.show(this.props.ui.alert.msg, {
        type: this.props.ui.alert.type,
        timeout: 1750
      });
      this.props.hideAlertMessage();
    }
  }
  render() {
    return <Shell channel={this.props.channel}></Shell>;
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  hideAlertMessage: () => dispatch(hideAlertMessage()),
  dispatchMsg: msg => dispatch(dispatchMsg(msg)),
  getUser: channel => dispatch(getUser(channel))
});

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(App));
