import React, { Component } from "react";
import { connect } from "react-redux";
import "../styles/slider.css";
import Node from "./node";
import RichText from "./richText";

class SubMenuShell extends Component {
  state = {
    page: <RichText />,
    text: ""
  };

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ page: <Node /> })}>
          node settings
        </button>
        <button onClick={() => this.setState({ page: <RichText /> })}>
          notepad
        </button>
        {this.state.page}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, props) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SubMenuShell);
