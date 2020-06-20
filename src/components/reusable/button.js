import React, { Component } from "react";

class Button extends Component {
  render() {
    return (
      <button
        style={{ margin: "5px" }}
        onClick={this.props.click}
        className="button is-success is-rounded is-light is-small"
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
