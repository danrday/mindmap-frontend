import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { hideAlertMessage } from "./redux/actions/ui";
import Page from "./components/Page";
import F4 from "./components/pages/f4";
import {withAlert} from "react-alert";

class App extends Component {

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
        <Page>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(App));