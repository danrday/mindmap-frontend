import React, { Component } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";

class Link extends React.Component {
  componentDidMount() {
    d3.select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(enterLink(this.props.displayAttr));
  }
  componentDidUpdate() {
    d3.select(ReactDOM.findDOMNode(this))
      // won't update bg if uncommented
      // .selectAll(".node")
      .datum(this.props.data)
      .call(enterLink(this.props.displayAttr));
  }
  render() {
    return <line className="link" />;
  }
}
const enterLink = displayAttr => {
  return selection => {
    selection
      .attr("stroke-width", function(d) {
        return displayAttr(d, "strokeWidth");
      })
      .style("stroke", "brown")
      .style("opacity", ".2");
  };
};

export default Link;
