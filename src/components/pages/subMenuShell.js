import React, { Component } from "react";
import { connect } from "react-redux";
import "../styles/slider.css";
import Node from "./node";
import RichText from "./richText";
import Button from "../reusable/button";

class SubMenuShell extends Component {
  state = {
    page: <RichText />,
    text: ""
  };

  render() {
    return (
      <div>
        <div style={{ backgroundColor: "darkblue" }}>
          <Button click={() => this.setState({ page: <Node /> })}>
            Settings
          </Button>
          <Button click={() => this.setState({ page: <RichText /> })}>
            Notepad
          </Button>
        </div>
        {this.state.page}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, props) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SubMenuShell);
