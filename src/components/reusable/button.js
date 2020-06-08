import React, { Component } from "react";

class Button extends Component {
  render() {
    return (
      <button
        onClick={this.props.click}
        className="button is-success is-rounded is-light"
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
