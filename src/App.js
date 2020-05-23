import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { hideAlertMessage } from "./redux/actions/ui";
import { dispatchMsg } from "./redux/actions/fromChannel";
import Page from "./components/Page";
import F4 from "./components/pages/f4";
import { withAlert } from "react-alert";

class App extends Component {
  componentDidMount() {
    // LISTEN FOR ACTIONS FROM THE PHOENIX SERVER
    this.props.channel.on("server_msg", msg => {
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
    return (
      <div className="App">
        <Page channel={this.props.channel}>
          <F4 />
        </Page>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
  hideAlertMessage: () => dispatch(hideAlertMessage()),
  dispatchMsg: msg => dispatch(dispatchMsg(msg))
});

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(App));
