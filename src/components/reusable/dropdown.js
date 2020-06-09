import React, { Component } from "react";

class Dropdown extends Component {
  state = {
    open: false
  };

  render() {
    return (
      <div
        style={{ margin: "10px" }}
        onClick={() => this.setState({ open: !this.state.open })}
        className={`dropdown ${this.state.open ? "is-active" : ""}`}
      >
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{this.props.value}</span>
            <span className="icon is-small">
              <i className="icon ion-arrow-down-b" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {Object.keys(this.props.categories).map((cat, i) => {
              return (
                <a
                  onClick={e => this.props.onChange(cat)}
                  className="dropdown-item"
                  key={i}
                  value={cat}
                >
                  {cat}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Dropdown;
