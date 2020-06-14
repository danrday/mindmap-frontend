import React, { Component } from "react";

class Switch extends Component {
  render() {
    return (
      <label className="switch">
        <input
          name={this.props.name}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <span className="slider round" />
      </label>
    );
  }
}

export default Switch;
