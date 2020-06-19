import React, { Component } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";

class Link extends React.Component {
  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink(this.props.displayAttr));
  }
  shouldComponentUpdate(nextProps) {
    const lockedLink = this.props.lockedLinks[this.props.data.id];
    const freshLink = nextProps.data !== this.props.data;
    const lastClicked = nextProps.lastClickedLink === this.props.data.id;
    const unClicked =
      this.props.lastClickedLink === this.props.data.id &&
      nextProps.lastClickedLink !== this.props.lastClickedLink;
    return freshLink || lastClicked || unClicked || lockedLink;
  }
  componentDidUpdate() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink(this.props.displayAttr, this.props.lastClickedLink));
  }
  render() {
    let lockedLink = this.props.lockedLinks[this.props.data.id];
    return (
      <line
        className="link"
        cursor={lockedLink ? "not-allowed" : "pointer"}
        onClick={e => {
          // prevent context menu from coming up
          e.stopPropagation();
          if (lockedLink) {
            alert("This link is being edited by another user...");
            d3.event.preventDefault();
          } else {
            this.props.handleClick(this.props.data.id);
            this.props.selectPage(5);
          }
        }}
      />
    );
  }
}

const enterLink = (displayAttr, lastClickedLink) => {
  return selection => {
    selection
      .attr("stroke-width", function(d) {
        return displayAttr(d, "strokeWidth");
      })
      .style("stroke", function(d) {
        if (d.id === lastClickedLink) {
          return "purple";
        } else {
          return "brown";
        }
      })
      .style("opacity", ".2");
  };
};

export default Link;
