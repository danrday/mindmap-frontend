import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
import { simpleAction } from "./redux/actions/simpleAction";
import Page from "./components/Page";
import F4 from "./components/pages/f4";

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<header className="App-header">*/}
        {/*  <img src={logo} className="App-logo" alt="logo" />*/}
        {/*  <h1 className="App-title">Welcomdsfgasdf de to React</h1>*/}

        {/*  <pre>{JSON.stringify(this.props)}</pre>*/}

        {/*  <button onClick={this.simpleAction}>Test redux action</button>*/}
        {/*</header>*/}
        <Page>
          <F4 />
        </Page>
      </div>
    );
  }
  simpleAction = event => {
    this.props.simpleAction();
  };
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
